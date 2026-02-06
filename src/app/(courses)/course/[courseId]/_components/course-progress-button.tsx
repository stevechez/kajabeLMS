'use client';

import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

interface CourseProgressButtonProps {
	lessonId: string;
	courseId: string;
	isCompleted?: boolean;
	nextLessonId?: string;
}

export const CourseProgressButton = ({
	lessonId,
	courseId,
	isCompleted,
	nextLessonId,
}: CourseProgressButtonProps) => {
	const router = useRouter();
	const supabase = createClient();
	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);

			// We use an upsert to either create the progress record or update it
			const { error } = await supabase.from('user_progress').upsert(
				{
					lesson_id: lessonId,
					is_completed: !isCompleted,
				},
				{
					onConflict: 'user_id,lesson_id', // Ensure your DB has a unique constraint here
				},
			);

			if (error) throw error;

			// Logic: If they just completed it and there's a next lesson, move them forward
			if (!isCompleted && nextLessonId) {
				router.push(`/courses/${courseId}/lessons/${nextLessonId}`);
			}

			router.refresh();
		} catch (error) {
			console.error('Something went wrong', error);
		} finally {
			setIsLoading(false);
		}
	};

	const Icon = isCompleted ? CheckCircle : Circle;

	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			type="button"
			variant={isCompleted ? 'default' : 'outline'}
			className="w-full md:w-auto"
		>
			{isCompleted ? 'Completed' : 'Mark as complete'}
			<Icon className="h-4 w-4 ml-2" />
		</Button>
	);
};
