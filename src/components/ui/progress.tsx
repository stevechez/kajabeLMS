'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

// 1. Define the props to include our custom 'variant'
interface ProgressProps extends React.ComponentPropsWithoutRef<
	typeof ProgressPrimitive.Root
> {
	variant?: 'default' | 'success';
}

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	ProgressProps
>(({ className, value, variant, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		data-slot="progress"
		className={cn(
			'relative h-2 w-full overflow-hidden rounded-full bg-slate-200', // Standardized background
			className,
		)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			data-slot="progress-indicator"
			className={cn(
				'h-full w-full flex-1 transition-all',
				// 2. This logic controls the color based on the variant
				variant === 'success' ? 'bg-emerald-600' : 'bg-blue-600',
			)}
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
