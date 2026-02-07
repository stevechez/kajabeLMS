import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CourseEnrollButton } from '@/components/shared/course-enroll-button';

export default async function CourseIdPage({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	const { courseId } = await params;
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return redirect('/');

	// 1. Fetch course details
	const { data: course } = await supabase
		.from('courses')
		.select(`*, modules (lessons (*))`)
		.eq('id', courseId)
		.single();

	// 2. Check if user has already purchased this course
	const { data: purchase } = await supabase
		.from('purchases')
		.select('*')
		.eq('user_id', user.id)
		.eq('course_id', courseId)
		.single();

	// 3. If purchased, redirect them to the first lesson
	if (purchase) {
		return redirect(
			`/courses/${courseId}/lessons/${course.modules[0].lessons[0].id}`,
		);
	}

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="flex flex-col md:flex-row items-center justify-between border-b pb-6 mb-6">
				<div>
					<h1 className="text-3xl font-bold">{course.title}</h1>
					<p className="text-slate-500 mt-2">{course.description}</p>
				</div>
				<CourseEnrollButton price={course.price!} courseId={courseId} />
			</div>
			{/* List modules/lessons as a "Preview" here */}
		</div>
	);
}
