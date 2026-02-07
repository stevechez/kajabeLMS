import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CourseCard } from '@/components/shared/course-card';
import { CourseWithFullData } from '@/types';

export default async function DashboardPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return redirect('/');

	// Fetch courses that the user has purchased
	const { data: purchasedData } = await supabase
		.from('purchases')
		.select(
			`
      course:courses (
        *,
        modules (
          lessons (
            *,
            user_progress (is_completed)
          )
        )
      )
    `,
		)
		.eq('user_id', user.id);

	// Flatten the response and cast to our type
	const courses =
		(purchasedData?.map(p => p.course) as unknown as CourseWithFullData[]) ||
		[];

	return (
		<div className="p-6 space-y-4">
			<div className="flex flex-col gap-y-2">
				<h1 className="text-2xl font-medium">My Learning</h1>
				<p className="text-sm text-slate-500">Continue where you left off</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{courses.map(course => {
					// Calculate total progress percentage for the card
					const allLessons = course.modules.flatMap(m => m.lessons);
					const completedCount = allLessons.filter(
						l => l.user_progress?.[0]?.is_completed,
					).length;
					const progress =
						allLessons.length === 0
							? 0
							: (completedCount / allLessons.length) * 100;

					return (
						<CourseCard
							key={course.id}
							id={course.id}
							title={course.title}
							thumbnailUrl={course.thumbnail_url}
							lessonsCount={allLessons.length}
							price={null} // Don't show price for owned courses
							progress={progress}
						/>
					);
				})}
			</div>

			{courses.length === 0 && (
				<div className="text-center text-sm text-muted-foreground mt-10">
					You haven&apos;t purchased any courses yet.
				</div>
			)}
		</div>
	);
}
