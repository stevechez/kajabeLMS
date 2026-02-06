import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CourseWithFullData } from '@/types';
import { CourseSidebarItem } from './course-sidebar-item';
import { CourseProgress } from '@/components/shared/course-progress';

interface CourseSidebarProps {
	course: CourseWithFullData;
	currentLessonId?: string;
}

export const CourseSidebar = async ({
	course,
	currentLessonId,
}: CourseSidebarProps) => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return redirect('/');

	// Calculate Progress
	const allLessons = course.modules.flatMap(m => m.lessons);
	const completedLessons = allLessons.filter(
		l => l.user_progress?.[0]?.is_completed,
	);
	const progressValue =
		allLessons.length === 0
			? 0
			: (completedLessons.length / allLessons.length) * 100;

	return (
		<div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
			<div className="p-8 flex flex-col border-b">
				<h1 className="font-semibold text-xl mb-4">{course.title}</h1>
				{/* Progress Bar added here */}
				<div className="mt-2">
					<CourseProgress
						variant={progressValue === 100 ? 'success' : 'default'}
						value={progressValue}
						size="sm"
					/>
				</div>
			</div>
			<div className="flex flex-col w-full">
				{course.modules
					.sort((a, b) => a.order_index - b.order_index)
					.map(module => (
						<div key={module.id} className="p-4 border-b last:border-0">
							<p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
								{module.title}
							</p>
							<div className="flex flex-col gap-y-1">
								{module.lessons
									.sort((a, b) => a.order_index - b.order_index)
									.map(lesson => (
										<CourseSidebarItem
											key={lesson.id}
											id={lesson.id}
											label={lesson.title}
											isCompleted={!!lesson.user_progress?.[0]?.is_completed}
											courseId={course.id}
											isActive={currentLessonId === lesson.id}
										/>
									))}
							</div>
						</div>
					))}
			</div>
		</div>
	);
};
