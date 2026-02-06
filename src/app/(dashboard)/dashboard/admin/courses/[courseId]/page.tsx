import { createClient } from '@/utils/supabase/server';
import { CategoryForm } from './_components/category-form';

// ... other imports

export default async function CourseIdPage({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	const { courseId } = await params;
	const supabase = await createClient();

	const { data: course } = await supabase
		.from('courses')
		.select('*')
		.eq('id', courseId)
		.single();

	const { data: categories } = await supabase
		.from('categories')
		.select('*')
		.order('name', { ascending: true });

	// Map categories to the format the Combobox expects
	const categoryOptions =
		categories?.map(category => ({
			label: category.name,
			value: category.id,
		})) || [];

	return (
		<div className="p-6">
			{/* ... other forms (Title, Description, etc.) ... */}

			<CategoryForm
				initialData={course}
				courseId={course.id}
				options={categoryOptions}
			/>
		</div>
	);
}
