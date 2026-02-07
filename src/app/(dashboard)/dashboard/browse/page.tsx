import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/shared/course-card';
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/shared/search-input';
import { CourseWithFullData } from '@/types';
import { redirect } from 'next/navigation';

interface BrowsePageProps {
	searchParams: Promise<{
		title?: string;
		categoryId?: string;
	}>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
	const supabase = await createClient();
	const { title, categoryId } = await searchParams;

	// 1. Get current user
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return redirect('/');

	// 2. Fetch Categories
	const { data: categories } = await supabase
		.from('categories')
		.select('*')
		.order('name', { ascending: true });

	// 3. Build the course query including progress and category names
	let coursesQuery = supabase
		.from('courses')
		.select(
			`
            *,
            category:categories(name),
            modules (
                id,
                lessons (
                    id,
                    user_progress:user_progress(is_completed)
                )
            )
        `,
		)
		.eq('is_published', true)
		// Ensure we only fetch progress for the logged-in user
		.eq('modules.lessons.user_progress.user_id', user.id)
		.order('created_at', { ascending: false });

	if (title) {
		coursesQuery = coursesQuery.ilike('title', `%${title}%`);
	}

	if (categoryId) {
		coursesQuery = coursesQuery.eq('category_id', categoryId);
	}

	const { data } = await coursesQuery;
	const courses = (data as unknown as CourseWithFullData[]) || [];

	return (
		<div className="p-6 space-y-4">
			<div className="md:hidden block mb-4">
				<SearchInput />
			</div>

			<Categories items={categories || []} />

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{courses.map(course => {
					// Calculate Total Lessons and Progress
					const allLessons = course.modules?.flatMap(m => m.lessons) || [];
					const lessonsCount = allLessons.length;

					const completedLessons = allLessons.filter(
						l => l.user_progress?.[0]?.is_completed,
					).length;

					// Calculate percentage (null if 0 lessons, otherwise 0-100)
					const progressPercentage =
						lessonsCount > 0 ? (completedLessons / lessonsCount) * 100 : null;

					return (
						<CourseCard
							key={course.id}
							id={course.id}
							title={course.title}
							thumbnailUrl={course.thumbnail_url || ''}
							chaptersCount={lessonsCount} // Using chaptersCount to match your CourseCard prop
							price={course.price || 0}
							category={course.category?.name || 'Uncategorized'}
							progress={progressPercentage}
						/>
					);
				})}
			</div>

			{courses.length === 0 && (
				<div className="text-center text-sm text-muted-foreground mt-10">
					No courses found matching your criteria.
				</div>
			)}
		</div>
	);
}
