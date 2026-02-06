import { CourseWithFullData } from '@/types';
import { CourseMobileSidebar } from './course-mobile-sidebar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface CourseNavbarProps {
	course: CourseWithFullData;
}

export const CourseNavbar = ({ course }: CourseNavbarProps) => {
	return (
		<div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
			<CourseMobileSidebar course={course} />
			<div className="flex items-center ml-auto gap-x-2">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/dashboard">
						<LogOut className="h-4 w-4 mr-2" />
						Exit
					</Link>
				</Button>
			</div>
		</div>
	);
};
