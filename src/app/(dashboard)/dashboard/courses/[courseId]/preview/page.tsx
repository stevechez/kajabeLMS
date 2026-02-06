import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

// 1. Import your new types
import { CourseWithFullData } from '@/types';

interface CoursePreviewProps {
	params: Promise<{ courseId: string }>;
}

export default async function CoursePreviewPage({
	params,
}: CoursePreviewProps) {
	const supabase = await createClient();
	const { courseId } = await params;

	// 2. Cast the response to your interface
	const { data: course } = (await supabase
		.from('courses')
		.select(
			`
      *,
      modules (
        id,
        title,
        order_index,
        lessons (
          id,
          title,
          order_index
        )
      )
    `,
		)
		.eq('id', courseId)
		.single()) as { data: CourseWithFullData | null };

	if (!course) return redirect('/dashboard/browse');

	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: purchase } = await supabase
		.from('purchases')
		.select('*')
		.eq('course_id', courseId)
		.eq('user_id', user?.id)
		.single();

	return (
		<div className="p-6 max-w-5xl mx-auto space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-4">
					<div className="relative aspect-video rounded-md overflow-hidden border">
						<Image
							fill
							className="object-cover"
							alt={course.title}
							src={course.thumbnail_url || '/placeholder-course.jpg'}
						/>
					</div>
					<h1 className="text-3xl font-bold">{course.title}</h1>
					<p className="text-slate-600 leading-relaxed">
						{course.description || 'No description provided.'}
					</p>
				</div>

				<div className="border rounded-md p-6 bg-slate-50 h-fit space-y-4">
					<div className="text-2xl font-bold text-blue-700">
						{course.price ? `$${course.price.toLocaleString()}` : 'Free'}
					</div>
					<Separator />
					<div className="flex items-center gap-x-2 text-slate-700 font-medium">
						<BookOpen className="w-5 h-5 text-blue-600" />
						<span>{course.modules.length} Modules</span>
					</div>

					{purchase ? (
						<Button className="w-full" variant="success" asChild>
							<a href={`/courses/${courseId}`}>Go to Course</a>
						</Button>
					) : (
						<Button className="w-full size-lg bg-blue-600 hover:bg-blue-700">
							Enroll Now
						</Button>
					)}
				</div>
			</div>

			<Separator />

			<div className="space-y-4">
				<h2 className="text-2xl font-semibold">Course Content</h2>
				<div className="space-y-3">
					{/* 3. Sorting is now fully type-safe! */}
					{course.modules
						.sort((a, b) => a.order_index - b.order_index)
						.map(module => (
							<div
								key={module.id}
								className="border rounded-md p-4 bg-white shadow-sm"
							>
								<h3 className="font-bold text-lg text-slate-800">
									{module.title}
								</h3>
								<div className="mt-3 space-y-2">
									{module.lessons
										.sort((a, b) => a.order_index - b.order_index)
										.map(lesson => (
											<div
												key={lesson.id}
												className="text-sm text-slate-600 flex items-center bg-slate-50 p-2 rounded"
											>
												<div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
												{lesson.title}
											</div>
										))}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
