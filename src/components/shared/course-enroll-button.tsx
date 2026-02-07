'use client';

import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
// import { formatPrice } from '@/lib/format'; // Optional helper for currency

interface CourseEnrollButtonProps {
	price: number;
	courseId: string;
}

export const CourseEnrollButton = ({
	price,
	courseId,
}: CourseEnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);

			// Call our API route to create the Stripe session
			const response = await axios.post(`/api/courses/${courseId}/checkout`);

			// Redirect to the Stripe checkout page
			window.location.assign(response.data.url);
		} catch (error) {
			console.error('Enrollment error', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			size="sm"
			className="w-full md:w-auto"
		>
			Enroll for ${price}
		</Button>
	);
};
