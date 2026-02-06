import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/shared/course-card';
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/shared/search-input';
import { CourseWithFullData } from '@/types'; // Keeping your custom type

interface BrowsePageProps {
	searchParams: Promise<{
		title?: string;
		categoryId?: string;
	}>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
	const supabase = await createClient();
	const { title, categoryId } = await searchParams;

	// 1. Fetch Categories for the top bar
	const { data: categories } = await supabase
		.from('categories')
		.select('*')
		.order('name', { ascending: true });

	// 2. Build the dynamic course query
	let query = supabase
		.from('courses')
		.select(
			`
            *,
            modules (
                id,
                order_index,
                lessons (
                    id
                )
            )
            `,
		)
		.eq('is_published', true)
		.order('created_at', { ascending: false });

	if (title) {
		query = query.ilike('title', `%${title}%`);
	}

	if (categoryId) {
		query = query.eq('category_id', categoryId);
	}

	const { data } = await query;

	// Use your CourseWithFullData type here to cast the data
	const courses = data as unknown as CourseWithFullData[];

	return (
		<div className="p-6 space-y-4">
			{/* Search visible on mobile only here; typically in sidebar on desktop */}
			<div className="md:hidden block mb-4">
				<SearchInput />
			</div>

			<Categories items={categories || []} />

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{courses?.map(course => {
					// Pre-calculate count to keep the JSX clean
					const lessonsCount =
						course.modules?.reduce(
							(acc, m) => acc + (m.lessons?.length || 0),
							0,
						) || 0;

					return (
						<CourseCard
							key={course.id}
							id={course.id}
							title={course.title}
							thumbnailUrl={course.thumbnail_url}
							lessonsCount={lessonsCount}
							price={course.price}
							progress={null}
						/>
					);
				})}
			</div>

			{courses?.length === 0 && (
				<div className="text-center text-sm text-muted-foreground mt-10">
					No courses found matching your criteria.
				</div>
			)}
		</div>
	);
}
