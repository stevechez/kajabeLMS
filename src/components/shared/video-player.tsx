"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  lessonId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title?: string;
}

export const VideoPlayer = ({
  playbackId,
  isLocked,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm font-medium">This lesson is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          onCanPlay={() => setIsReady(true)}
          autoPlay
          className="w-full h-full"
        />
      )}
    </div>
  );
};
