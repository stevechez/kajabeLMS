import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CourseActions } from "./_components/course-actions";
import { ModuleForm } from "./_components/module-form";
import { LayoutDashboard, ListChecks } from "lucide-react";

export default async function CourseIdPage({ params }: { params: { courseId: string } }) {
  const supabase = await createClient();
  const { courseId } = await params;

  const { data: course } = await supabase
    .from("courses")
    .select(`*, modules(id, title, order_index)`)
    .eq("id", courseId)
    .single();

  if (!course) return redirect("/dashboard");

  const requiredFields = [course.title, course.description, course.modules.length > 0];
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${requiredFields.length})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Course setup</h1>
          <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
        </div>
        <CourseActions courseId={courseId} isPublished={course.is_published} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <div className="p-2 bg-blue-100 rounded-full"><LayoutDashboard className="text-blue-700" /></div>
            <h2 className="text-xl">Customize your course</h2>
          </div>
          {/* Add TitleForm and DescriptionForm here later */}
          <div className="p-4 bg-slate-50 border rounded-md mt-4">
            <p className="font-bold">{course.title}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <div className="p-2 bg-blue-100 rounded-full"><ListChecks className="text-blue-700" /></div>
              <h2 className="text-xl">Course curriculum</h2>
            </div>
            <ModuleForm courseId={courseId} initialModules={course.modules || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
