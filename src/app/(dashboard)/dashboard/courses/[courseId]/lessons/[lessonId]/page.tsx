import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Video } from "lucide-react";

import { LessonActions } from "./_components/lesson-actions";
import { VideoUploadForm } from "../../_components/video-upload-form"; // Reusing or moving the component

interface LessonIdPageProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonIdPage({ params }: LessonIdPageProps) {
  const supabase = await createClient();
  const { courseId, lessonId } = await params;

  // 1. Fetch lesson data
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select(`*`)
    .eq("id", lessonId)
    .single();

  if (!lesson || error) {
    return redirect(`/dashboard/courses/${courseId}`);
  }

  const requiredFields = [lesson.title, lesson.video_playback_id];
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${requiredFields.length})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-bold">Lesson Creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
            <LessonActions 
              courseId={courseId}
              lessonId={lessonId}
              isPublished={lesson.is_published}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <LayoutDashboard className="text-blue-700 w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">Customize your lesson</h2>
            </div>
            {/* You can add a TitleForm here later */}
            <div className="mt-6 border bg-slate-100 rounded-md p-4">
               <p className="font-bold">{lesson.title}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Video className="text-blue-700 w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold">Add a video</h2>
          </div>
          <VideoUploadForm 
            courseId={courseId}
            lessonId={lessonId}
            initialVideoUrl={lesson.video_playback_id}
          />
        </div>
      </div>
    </div>
  );
}
