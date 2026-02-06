import { CourseProgress } from '@/components/shared/course-progress';
import { CourseSidebarItem } from './course-sidebar-item';

interface Lesson {
	id: string;
	title: string;
	user_progress?: Array<{ is_completed: boolean }>;
}

interface Module {
	id: string;
	title: string;
	lessons: Lesson[];
}

interface Course {
	id: string;
	title: string;
	modules: Module[];
}

export const CourseSidebar = ({ course }: { course: Course }) => {
	// 1. Calculate Progress
	const allLessons = course.modules.flatMap((m: any) => m.lessons);
	const completedLessons = allLessons.filter(
		(lesson: any) => lesson.user_progress?.[0]?.is_completed,
	);

	const progressValue = (completedLessons.length / allLessons.length) * 100;

	return (
		<div className="h-full border-r flex flex-col overflow-y-auto shadow-sm bg-white">
			<div className="p-8 flex flex-col border-b">
				<h1 className="font-semibold text-slate-700 mb-4">{course.title}</h1>

				{/* 2. Insert the Progress Bar */}
				<div className="mt-2">
					<CourseProgress value={progressValue} size="sm" />
				</div>
			</div>

			<div className="flex flex-col w-full">
				{course.modules.map((module: any) => (
					<div key={module.id} className="p-4 border-b last:border-0">
						<p className="text-xs uppercase font-bold text-slate-500 mb-4">
							{module.title}
						</p>
						<div className="flex flex-col gap-y-1">
							{module.lessons.map((lesson: any) => (
								<CourseSidebarItem
									key={lesson.id}
									id={lesson.id}
									label={lesson.title}
									courseId={course.id}
									isCompleted={!!lesson.user_progress?.[0]?.is_completed}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
