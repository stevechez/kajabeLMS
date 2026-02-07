import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/shared/course-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';
import { CourseWithFullData } from '@/types';
import { HomeNavbar } from '@/components/shared/home-navbar';

export default async function HomePage() {
	const supabase = await createClient();

	// 1. Fetch the data before the return statement
	const { data: rawCourses } = await supabase
		.from('courses')
		.select(
			`
      *,
      modules (
        lessons (id)
      )
    `,
		)
		.eq('is_published', true)
		.order('created_at', { ascending: false })
		.limit(4);

	// 2. Cast the data for type safety
	const courses = (rawCourses as unknown as CourseWithFullData[]) || [];

	return (
		<div className="flex flex-col min-h-screen">
			<HomeNavbar />
			{/* Hero Section */}
			<section className="bg-slate-50 py-20 px-6 border-b">
				<div className="max-w-5xl mx-auto text-center space-y-6">
					<h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
						Master New Skills with{' '}
						<span className="text-blue-700">Expert Courses</span>
					</h1>
					<p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
						Access high-quality video lessons, track your progress, and join a
						community of lifelong learners.
					</p>
					<div className="flex items-center justify-center gap-x-4">
						<Button size="lg" asChild>
							<Link href="/dashboard/browse">
								Browse All Courses <ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/dashboard">My Dashboard</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 px-6 max-w-5xl mx-auto w-full">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl border bg-white shadow-sm">
						<div className="p-3 bg-blue-100 rounded-full text-blue-700">
							<BookOpen className="h-6 w-6" />
						</div>
						<h3 className="font-bold text-lg">Self-Paced Learning</h3>
						<p className="text-sm text-slate-500">
							Learn at your own speed with lifetime access to your purchased
							content.
						</p>
					</div>
					<div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl border bg-white shadow-sm">
						<div className="p-3 bg-emerald-100 rounded-full text-emerald-700">
							<ShieldCheck className="h-6 w-6" />
						</div>
						<h3 className="font-bold text-lg">Secure Payments</h3>
						<p className="text-sm text-slate-500">
							Safe and easy checkout powered by Stripe integration.
						</p>
					</div>
					<div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl border bg-white shadow-sm">
						<div className="p-3 bg-purple-100 rounded-full text-purple-700">
							<GraduationCap className="h-6 w-6" />
						</div>
						<h3 className="font-bold text-lg">Progress Tracking</h3>
						<p className="text-sm text-slate-500">
							Visualize your journey with completion bars and next-lesson
							auto-play.
						</p>
					</div>
				</div>
			</section>

			{/* Featured Courses Section */}
			<section className="py-16 px-6 bg-white flex-grow">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-3xl font-bold text-slate-900">
							Featured Courses
						</h2>
						<Link
							href="/dashboard/browse"
							className="text-blue-700 hover:underline font-medium text-sm"
						>
							View all
						</Link>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{courses.map(course => (
							<CourseCard
								key={course.id}
								id={course.id}
								title={course.title}
								thumbnailUrl={course.thumbnail_url}
								lessonsCount={course.modules.reduce(
									(acc, m) => acc + (m.lessons?.length || 0),
									0,
								)}
								price={course.price}
								progress={null}
							/>
						))}
					</div>

					{courses.length === 0 && (
						<div className="text-center py-20 text-slate-500 border-2 border-dashed rounded-xl">
							No courses published yet. Check back soon!
						</div>
					)}
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t py-8 text-center text-sm text-slate-500 bg-slate-50">
				<p>© {new Date().getFullYear()} Kajabi Clone. All rights reserved.</p>
			</footer>
		</div>
	);
}
