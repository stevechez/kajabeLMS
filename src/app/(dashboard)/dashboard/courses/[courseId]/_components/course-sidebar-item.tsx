'use client';

import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CourseSidebarItemProps {
	label: string;
	id: string;
	isCompleted: boolean;
	courseId: string;
	isLocked: boolean;
}

export const CourseSidebarItem = ({
	label,
	id,
	isCompleted,
	courseId,
	isLocked,
}: CourseSidebarItemProps) => {
	const pathname = usePathname();
	const router = useRouter();

	const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
	const isActive = pathname?.includes(id);

	const onClick = () => {
		router.push(`/courses/${courseId}/lessons/${id}`);
	};

	return (
		<button
			onClick={onClick}
			disabled={isLocked}
			type="button"
			className={cn(
				'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
				isActive &&
					'text-blue-700 bg-blue-200/20 hover:bg-blue-200/20 hover:text-blue-700',
				isCompleted && 'text-emerald-700 hover:text-emerald-700',
				isCompleted && isActive && 'bg-emerald-200/20',
				isLocked &&
					'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-slate-500',
			)}
		>
			<div className="flex items-center gap-x-2 py-4">
				<Icon
					size={22}
					className={cn(
						'text-slate-500',
						isActive && 'text-blue-700',
						isCompleted && 'text-emerald-700',
					)}
				/>
				{label}
			</div>
			<div
				className={cn(
					'ml-auto opacity-0 border-2 border-blue-700 h-full transition-all',
					isActive && 'opacity-100',
					isCompleted && 'border-emerald-700',
				)}
			/>
		</button>
	);
};
