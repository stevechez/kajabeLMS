"use client";

import { Trash, Rocket, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface CourseActionsProps {
  courseId: string;
  isPublished: boolean;
}

export const CourseActions = ({ courseId, isPublished }: CourseActionsProps) => {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const onTogglePublish = async () => {
    try {
      setIsLoading(true);
      await supabase
        .from("courses")
        .update({ is_published: !isPublished })
        .eq("id", courseId);
      
      router.refresh();
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onTogglePublish}
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? <EyeOff className="h-4 w-4 mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button size="sm" variant="destructive" disabled={isLoading}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
