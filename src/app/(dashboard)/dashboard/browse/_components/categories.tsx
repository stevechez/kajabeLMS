'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
	FcEngineering,
	FcFilmReel,
	FcMultipleDevices,
	FcMusic,
	FcOldTimeCamera,
	FcSalesPerformance,
	FcSportsMode,
} from 'react-icons/fc';
import { IconType } from 'react-icons';

const iconMap: Record<string, IconType> = {
	Music: FcMusic,
	Photography: FcOldTimeCamera,
	Fitness: FcSportsMode,
	Business: FcSalesPerformance,
	'Computer Science': FcMultipleDevices,
	Filming: FcFilmReel,
	Engineering: FcEngineering,
};

interface CategoriesProps {
	items: { id: string; name: string }[];
}

export const Categories = ({ items }: CategoriesProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentCategoryId = searchParams.get('categoryId');

	const onClick = (id: string | null) => {
		const params = new URLSearchParams(searchParams.toString());

		if (id === currentCategoryId || !id) {
			params.delete('categoryId');
		} else {
			params.set('categoryId', id);
		}

		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="flex items-center gap-x-2 overflow-x-auto pb-2">
			<button
				onClick={() => onClick(null)}
				className={cn(
					'py-2 px-3 text-sm border rounded-full flex items-center gap-x-1 hover:border-blue-700 transition',
					!currentCategoryId && 'border-blue-700 bg-blue-200/20 text-blue-800',
				)}
			>
				All
			</button>
			{items.map(item => {
				const Icon = iconMap[item.name] || FcEngineering;
				const isSelected = currentCategoryId === item.id;

				return (
					<button
						key={item.id}
						onClick={() => onClick(item.id)}
						className={cn(
							'py-2 px-3 text-sm border rounded-full flex items-center gap-x-1 hover:border-blue-700 transition whitespace-nowrap',
							isSelected && 'border-blue-700 bg-blue-200/20 text-blue-800',
						)}
					>
						<Icon size={20} />
						<div className="truncate">{item.name}</div>
					</button>
				);
			})}
		</div>
	);
};
