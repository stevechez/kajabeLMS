import { createClient } from '@/utils/supabase/server';
import { CourseWithFullData } from '@/types';

export const getDashboardCourses = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return { completedCourses: [], coursesInProgress: [] };

	// 1. Fetch courses the user has purchased
	const { data: purchases } = await supabase
		.from('purchases')
		.select(
			`
      course_id,
      courses (
        *,
        modules (
          lessons (
            id,
            user_progress (
              is_completed
            )
          )
        )
      )
    `,
		)
		.eq('user_id', user.id);

	const courses = (purchases?.map(p => p.courses) ||
		[]) as unknown as CourseWithFullData[];

	// 2. Calculate progress for each course
	const coursesWithProgress = courses.map(course => {
		const allLessons = course.modules.flatMap(m => m.lessons);
		const completedLessons = allLessons.filter(
			l => l.user_progress?.[0]?.is_completed,
		);

		const progressValue =
			allLessons.length === 0
				? 0
				: (completedLessons.length / allLessons.length) * 100;

		return {
			...course,
			progress: progressValue,
		};
	});

	const completedCourses = coursesWithProgress.filter(c => c.progress === 100);
	const coursesInProgress = coursesWithProgress.filter(
		c => (c.progress ?? 0) < 100,
	);

	return {
		completedCourses,
		coursesInProgress,
	};
};
