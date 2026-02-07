import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CourseProgressProps {
	value: number;
	variant?: 'default' | 'success';
	size?: 'default' | 'sm';
}

const colorByVariant = {
	default: 'text-blue-700',
	success: 'text-emerald-700',
};

const sizeByVariant = {
	default: 'text-sm',
	sm: 'text-xs',
};

export const CourseProgress = ({
	value,
	variant,
	size,
}: CourseProgressProps) => {
	return (
		<div className="w-full">
			<Progress
				className="h-2"
				value={value}
				// We handle the color via className/global CSS usually,
				// but if your Progress component uses the 'indicator' pattern:
				variant={variant}
			/>
			<p
				className={cn(
					'font-medium mt-2 text-slate-700',
					colorByVariant[variant || 'default'],
					sizeByVariant[size || 'default'],
				)}
			>
				{Math.round(value)}% Complete
			</p>
		</div>
	);
};
