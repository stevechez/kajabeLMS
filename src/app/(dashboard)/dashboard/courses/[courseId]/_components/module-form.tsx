"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  title: z.string().min(1),
});

export const ModuleForm = ({ courseId, initialModules }: { courseId: string, initialModules: any[] }) => {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { title: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const { data: latestModule } = await supabase
        .from("modules")
        .select("order_index")
        .eq("course_id", courseId)
        .order("order_index", { ascending: false })
        .limit(1)
        .single();

      const nextOrder = (latestModule?.order_index ?? -1) + 1;

      await supabase.from("modules").insert({
        title: values.title,
        course_id: courseId,
        order_index: nextOrder,
      });

      form.reset();
      setIsCreating(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating module", error);
    }
  };

  return (
    <div className="mt-6 border bg-slate-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Modules
        <Button onClick={() => setIsCreating(!isCreating)} variant="ghost">
          {isCreating ? "Cancel" : (
            <><PlusCircle className="h-4 w-4 mr-2" /> Add a module</>
          )}
        </Button>
      </div>
      
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={form.formState.isSubmitting} placeholder="e.g. 'Introduction to the course'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">Create</Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div className="mt-4 space-y-2">
          {initialModules.length === 0 && <p className="text-sm text-slate-500 italic">No modules yet.</p>}
          {initialModules.map((module) => (
            <div key={module.id} className="flex items-center gap-x-2 bg-slate-200 border-slate-200 text-slate-700 rounded-md mb-4 text-sm px-3 py-2">
              {module.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
