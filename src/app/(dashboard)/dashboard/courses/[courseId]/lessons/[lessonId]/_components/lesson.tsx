"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

interface LessonActionsProps {
  courseId: string;
  lessonId: string;
  isPublished: boolean;
}

export const LessonActions = ({ courseId, lessonId, isPublished }: LessonActionsProps) => {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await supabase.from("lessons").delete().eq("id", lessonId);
      router.push(`/dashboard/courses/${courseId}`);
      router.refresh();
    } catch {
      console.error("Delete failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onTogglePublish = async () => {
    try {
      setIsLoading(true);
      await supabase
        .from("lessons")
        .update({ is_published: !isPublished })
        .eq("id", lessonId);
      
      router.refresh();
    } catch {
       console.error("Toggle failed");
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
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button size="sm" variant="destructive" disabled={isLoading} onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
