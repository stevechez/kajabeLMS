import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { LayoutDashboard, ListChecks, CircleDollarSign } from 'lucide-react';

import { CourseActions } from './_components/course-actions';
import { DescriptionForm } from './_components/description-form';
import { PriceForm } from './_components/price-form';
import { ImageForm } from './_components/image-form';
import { ModuleForm } from './_components/module-form';

interface CourseIdPageProps {
	params: Promise<{ courseId: string }>;
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
	const supabase = await createClient();

	// Await params to get courseId (Next.js 14/15 standard)
	const { courseId } = await params;

	// 1. Fetch course data and destructure as 'course'
	const { data: course, error } = await supabase
		.from('courses')
		.select(
			`
      *,
      modules (
        id,
        title,
        order_index
      )
    `,
		)
		.eq('id', courseId)
		.single();

	// 2. Redirect if course doesn't exist or there's an error
	if (!course || error) {
		return redirect('/dashboard');
	}

	// 3. Logic for completion tracking (Kajabi style)
	const requiredFields = [
		course.title,
		course.description,
		course.thumbnail_url,
		course.price !== null,
		course.modules.length > 0,
	];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;
	const isComplete = requiredFields.every(Boolean);

	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-y-2">
					<h1 className="text-2xl font-bold font-sans">Course setup</h1>
					<span className="text-sm text-slate-700">
						Complete all fields {completionText}
					</span>
				</div>
				{/* Actions for publishing/deleting */}
				<CourseActions courseId={courseId} isPublished={course.is_published} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				{/* LEFT COLUMN: Metadata */}
				<div className="space-y-6">
					<div>
						<div className="flex items-center gap-x-2">
							<div className="p-2 bg-blue-100 rounded-full">
								<LayoutDashboard className="text-blue-700 w-5 h-5" />
							</div>
							<h2 className="text-xl font-semibold">Customize your course</h2>
						</div>

						{/* Title display (can be turned into a TitleForm later) */}
						<div className="mt-6 border bg-slate-100 rounded-md p-4">
							<div className="font-medium flex items-center justify-between">
								Course title
							</div>
							<p className="text-sm mt-2 font-bold">{course.title}</p>
						</div>

						<ImageForm courseId={course.id} initialData={course} />

						<DescriptionForm courseId={course.id} initialData={course} />
					</div>
				</div>

				{/* RIGHT COLUMN: Curriculum & Pricing */}
				<div className="space-y-6">
					<div>
						<div className="flex items-center gap-x-2">
							<div className="p-2 bg-blue-100 rounded-full">
								<ListChecks className="text-blue-700 w-5 h-5" />
							</div>
							<h2 className="text-xl font-semibold">Course curriculum</h2>
						</div>
						<ModuleForm
							courseId={course.id}
							initialModules={course.modules || []}
						/>
					</div>

					<div>
						<div className="flex items-center gap-x-2">
							<div className="p-2 bg-blue-100 rounded-full">
								<CircleDollarSign className="text-blue-700 w-5 h-5" />
							</div>
							<h2 className="text-xl font-semibold">Sell your course</h2>
						</div>
						<PriceForm courseId={course.id} initialData={course} />
					</div>
				</div>
			</div>
		</div>
	);
}
