import Image from 'next/image';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CourseProgress } from '@/components/shared/course-progress';

interface CourseCardProps {
	id: string;
	title: string;
	thumbnailUrl: string | null;
	lessonsCount: number;
	price: number | null;
	progress: number | null; // Added this
}

export const CourseCard = ({
	id,
	title,
	thumbnailUrl,
	lessonsCount,
	price,
	progress,
}: CourseCardProps) => {
	return (
		<Link href={`/courses/${id}`}>
			<Card className="group hover:shadow-sm transition overflow-hidden border p-3 h-full">
				{/* Thumbnail Section */}
				<div className="relative w-full aspect-video rounded-md overflow-hidden">
					<Image
						fill
						className="object-cover"
						alt={title}
						src={thumbnailUrl || '/placeholder-course.jpg'}
					/>
				</div>

				{/* Content Section */}
				<div className="flex flex-col pt-2">
					<div className="text-lg md:text-base font-medium group-hover:text-blue-700 transition line-clamp-2">
						{title}
					</div>

					<div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
						<div className="flex items-center gap-x-1 text-slate-500">
							<BookOpen className="w-4 h-4" />
							<span>
								{lessonsCount} {lessonsCount === 1 ? 'Lesson' : 'Lessons'}
							</span>
						</div>
					</div>

					{/* Logic: Show Progress bar if it exists, otherwise show Price */}
					{progress !== null ? (
						<CourseProgress
							variant={progress === 100 ? 'success' : 'default'}
							size="sm"
							value={progress}
						/>
					) : (
						<p className="text-md md:text-sm font-medium text-slate-700">
							{price !== null ? `$${price.toLocaleString()}` : 'Free'}
						</p>
					)}
				</div>
			</Card>
		</Link>
	);
};
