import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { VideoPlayer } from '@/components/shared/video-player';
import { Separator } from '@/components/ui/separator';
import { CourseProgressButton } from './_components/course-progress-button';

interface LessonPageProps {
	params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
	const supabase = await createClient();
	const { courseId, lessonId } = await params;

	// 1. Fetch lesson, progress, and the full course curriculum to calculate "Next"
	// We fetch the modules and lessons sorted by order_index
	const { data: course } = await supabase
		.from('courses')
		.select(
			`
      modules (
        id,
        order_index,
        lessons (
          id,
          title,
          order_index
        )
      )
    `,
		)
		.eq('id', courseId)
		.single();

	const { data: lesson } = await supabase
		.from('lessons')
		.select(`*, user_progress(*)`)
		.eq('id', lessonId)
		.single();

	if (!lesson || !course) {
		return redirect('/dashboard');
	}

	// 2. Logic to find the NEXT lesson ID
	// Flatten all lessons into a single ordered array
	const allLessons = course.modules
		.sort((a, b) => a.order_index - b.order_index)
		.flatMap(module =>
			module.lessons.sort((a, b) => a.order_index - b.order_index),
		);

	const currentIndex = allLessons.findIndex(l => l.id === lessonId);
	const nextLesson = allLessons[currentIndex + 1];

	return (
		<div className="flex flex-col max-w-4xl mx-auto pb-20">
			<div className="p-4">
				{/* The Video Player component we built earlier */}
				<VideoPlayer
					playbackId={lesson.video_playback_id}
					title={lesson.title}
					courseId={courseId}
					lessonId={lessonId}
					isLocked={false} // You can flip this based on subscription status later
					completeOnEnd={true}
				/>
			</div>

			<div>
				<div className="p-6 flex flex-col md:flex-row items-center justify-between">
					<div className="flex flex-col gap-y-2 mb-4 md:mb-0">
						<h2 className="text-2xl font-bold">{lesson.title}</h2>
					</div>

					{/* The Progress Button we just created */}
					<CourseProgressButton
						lessonId={lessonId}
						courseId={courseId}
						nextLessonId={nextLesson?.id}
						isCompleted={!!lesson.user_progress?.[0]?.is_completed}
					/>
				</div>

				<Separator />

				<div className="p-6">
					<div className="prose max-w-none text-slate-700">
						{lesson.content ? (
							<p>{lesson.content}</p>
						) : (
							<p className="italic text-slate-500">
								No lesson description provided.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
