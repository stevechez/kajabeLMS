import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CourseSidebar } from './_components/course-sidebar';
import { CourseNavbar } from './_components/course-navbar';
import { CourseWithFullData } from '@/types';

export default async function CourseLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ courseId: string }>;
}) {
	const { courseId } = await params;
	const supabase = await createClient();

	const { data: course } = await supabase
		.from('courses')
		.select(
			`
      *,
      modules (
        *,
        lessons (
          *,
          user_progress (*)
        )
      )
    `,
		)
		.eq('id', courseId)
		.single();

	if (!course) return redirect('/');

	const typedCourse = course as unknown as CourseWithFullData;

	return (
		<div className="h-full">
			{/* Navbar: Height 80px, pushed to the right on desktop */}
			<div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
				<CourseNavbar course={typedCourse} />
			</div>

			{/* Sidebar: Width 80 (320px), hidden on mobile */}
			<div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
				<CourseSidebar course={typedCourse} />
			</div>

			{/* Main Content: Padded from top and left */}
			<main className="md:pl-80 pt-[80px] h-full">{children}</main>
		</div>
	);
}
