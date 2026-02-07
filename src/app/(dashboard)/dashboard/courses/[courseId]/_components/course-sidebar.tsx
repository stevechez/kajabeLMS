import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CourseProgress } from '@/components/shared/course-progress';
import { CourseSidebarItem } from './course-sidebar-item';
import { CourseWithFullData } from '@/types';

interface CourseSidebarProps {
	course: CourseWithFullData;
	progressCount: number;
}

export const CourseSidebar = async ({
	course,
	progressCount,
}: CourseSidebarProps) => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return redirect('/');

	// Check if user has purchased the course
	const { data: purchase } = await supabase
		.from('purchases')
		.select('*')
		.eq('user_id', user.id)
		.eq('course_id', course.id)
		.single();

	return (
		<div className="h-full border-r flex flex-col overflow-y-auto shadow-sm bg-white">
			<div className="p-8 flex flex-col border-b">
				<h1 className="font-semibold text-slate-700">{course.title}</h1>
				{purchase && (
					<div className="mt-10">
						<CourseProgress variant="success" value={progressCount} />
					</div>
				)}
			</div>
			<div className="flex flex-col w-full">
				{course.modules.map(module => (
					<div key={module.id} className="flex flex-col">
						{module.lessons.map(lesson => (
							<CourseSidebarItem
								key={lesson.id}
								id={lesson.id}
								label={lesson.title}
								isCompleted={!!lesson.user_progress?.[0]?.is_completed}
								courseId={course.id}
								isLocked={!purchase && !lesson.is_free}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
