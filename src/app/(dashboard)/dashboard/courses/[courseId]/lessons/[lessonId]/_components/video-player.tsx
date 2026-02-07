'use client';

interface VideoPlayerProps {
	playbackId: string | null;
	courseId: string;
	lessonId: string;
	title: string;
}

export const VideoPlayer = ({ playbackId, title }: VideoPlayerProps) => {
	if (!playbackId) {
		return (
			<div className="relative aspect-video bg-slate-800 flex items-center justify-center text-white">
				<p>No video available for this lesson.</p>
			</div>
		);
	}

	return (
		<div className="relative aspect-video">
			<iframe
				src={`https://www.youtube.com/embed/${playbackId}`}
				title={title}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				className="w-full h-full rounded-md shadow-sm"
			/>
		</div>
	);
};
