"use client";

import { useState } from "react";
import MuxUploader from "@mux/mux-uploader-react";
import { Pencil, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface VideoUploadProps {
  courseId: string;
  lessonId: string;
  initialVideoUrl?: string | null;
}

export const VideoUploadForm = ({ courseId, lessonId, initialVideoUrl }: VideoUploadProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadEndpoint, setUploadEndpoint] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const toggleEdit = async () => {
    if (!isEditing) {
      // Get the signed upload URL from our API
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/video`, { method: "POST" });
      const { url } = await response.json();
      setUploadEndpoint(url);
    }
    setIsEditing((prev) => !prev);
  };

  const onSuccess = async () => {
    setIsEditing(false);
    // You'll want a webhook or a polling mechanism to catch when Mux 
    // finishes processing the asset to save the Playback ID to Supabase.
    router.refresh();
  };

  return (
    <div className="mt-6 border bg-slate-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {initialVideoUrl ? "Edit video" : "Add video"}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialVideoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2 text-sm text-muted-foreground">
            Video is processed and ready.
          </div>
        )
      )}
      {isEditing && uploadEndpoint && (
        <div className="mt-4">
          <MuxUploader 
            endpoint={uploadEndpoint} 
            onSuccess={onSuccess}
            className="w-full"
          />
          <div className="text-xs text-muted-foreground mt-4">
            Videos can take a few minutes to process.
          </div>
        </div>
      )}
    </div>
  );
};
