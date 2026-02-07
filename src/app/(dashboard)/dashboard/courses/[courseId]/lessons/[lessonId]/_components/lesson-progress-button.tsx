'use client';

import { useState } from 'react';
import { CheckCircle, Undo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useConfettiStore } from '@/hooks/use-confetti-store'; // Optional: For the "win" moment

interface LessonProgressButtonProps {
	lessonId: string;
	courseId: string;
	isCompleted?: boolean;
	nextLessonId?: string; // Add this prop
}

export const LessonProgressButton = ({
	lessonId,
	courseId,
	isCompleted,
	nextLessonId,
}: LessonProgressButtonProps) => {
	const router = useRouter();
	const supabase = createClient();
	const confetti = useConfettiStore();
	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error('Unauthorized');

			const { error } = await supabase.from('user_progress').upsert(
				{
					user_id: user.id,
					lesson_id: lessonId,
					is_completed: !isCompleted,
				},
				{ onConflict: 'user_id,lesson_id' },
			);

			if (error) throw error;

			// If we just completed it and there's a next lesson, go there!
			if (!isCompleted && nextLessonId) {
				router.push(`/courses/${courseId}/lessons/${nextLessonId}`);
			}

			// If no next lesson, they finished the course!
			if (!isCompleted && !nextLessonId) {
				confetti.onOpen();
			}

			router.refresh();
		} catch (error) {
			console.error('Something went wrong', error);
		} finally {
			setIsLoading(false);
		}
	};

	const Icon = isCompleted ? Undo : CheckCircle;

	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			type="button"
			variant={isCompleted ? 'outline' : 'default'}
			className="w-full md:w-auto"
		>
			{isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
			<Icon className="h-4 w-4 ml-2" />
		</Button>
	);
};
