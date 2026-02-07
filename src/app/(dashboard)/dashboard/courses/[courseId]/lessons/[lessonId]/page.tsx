import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { VideoPlayer } from './_components/video-player';
import { LessonProgressButton } from './_components/lesson-progress-button';
import { Separator } from '@/components/ui/separator';
import { getNextLesson } from '@/actions/get-next-lesson';
import { CourseWithFullData } from '@/types';

export default async function LessonIdPage({
	params,
}: {
	params: Promise<{ courseId: string; lessonId: string }>;
}) {
	const { courseId, lessonId } = await params;
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return redirect('/');

	// 1. Fetch the lesson and its specific user progress
	const { data: lesson } = await supabase
		.from('lessons')
		.select(
			`
      *,
      user_progress (
        is_completed
      )
    `,
		)
		.eq('id', lessonId)
		.single();

	// 2. Fetch the full course structure to determine "Next Lesson"
	const { data: courseData } = await supabase
		.from('courses')
		.select(
			`
      *,
      modules (
        *,
        lessons (
          *
        )
      )
    `,
		)
		.eq('id', courseId)
		.single();

	if (!lesson || !courseData) return redirect('/dashboard');

	const typedCourse = courseData as unknown as CourseWithFullData;

	// 3. Calculate the next lesson using our action
	const nextLesson = getNextLesson(typedCourse, lessonId);
	const isCompleted = !!lesson.user_progress?.[0]?.is_completed;

	return (
		<div>
			<div className="flex flex-col max-w-4xl mx-auto pb-20">
				<div className="p-4">
					<VideoPlayer
						lessonId={lessonId}
						title={lesson.title}
						courseId={courseId}
						playbackId={lesson.video_playback_id}
					/>
				</div>
				<div>
					<div className="p-4 flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
						<LessonProgressButton
							lessonId={lessonId}
							courseId={courseId}
							isCompleted={isCompleted}
							nextLessonId={nextLesson?.id} // Passing the ID for auto-redirect
						/>
					</div>
					<Separator />
					<div className="p-4 text-slate-700 text-sm leading-relaxed">
						{lesson.description || 'No description provided.'}
					</div>
				</div>
			</div>
		</div>
	);
}
