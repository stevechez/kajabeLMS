'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface EnrollButtonProps {
	courseId: string;
}

export const EnrollButton = ({ courseId }: EnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`/api/courses/${courseId}/checkout`, {
				method: 'POST',
			});

			const data = await response.json();

			// Redirect to Stripe Checkout
			window.location.assign(data.url);
		} catch (error) {
			console.error('Checkout failed', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			className="w-full size-lg bg-blue-600 hover:bg-blue-700"
		>
			Enroll Now
		</Button>
	);
};
