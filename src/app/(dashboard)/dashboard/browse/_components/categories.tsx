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

// 1. Define the icon map
const iconMap: Record<string, IconType> = {
	Music: FcMusic,
	Photography: FcOldTimeCamera,
	Fitness: FcSportsMode,
	Business: FcSalesPerformance,
	'Computer Science': FcMultipleDevices,
	Filming: FcFilmReel,
	Engineering: FcEngineering,
};

// 2. Single, clean interface definition
interface Category {
	id: string;
	name: string;
}

interface CategoriesProps {
	items: Category[];
}

export const Categories = ({ items }: CategoriesProps) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const currentCategoryId = searchParams.get('categoryId');

	const onClick = (id: string | null) => {
		const url = new URL(window.location.href);

		if (id === currentCategoryId || !id) {
			url.searchParams.delete('categoryId');
		} else {
			url.searchParams.set('categoryId', id);
		}

		router.push(url.pathname + url.search);
	};

	return (
		<div className="flex items-center gap-x-2 overflow-x-auto pb-2 scrollbar-hide">
			{/* "All" Button */}
			<button
				onClick={() => onClick(null)}
				className={cn(
					'py-2 px-3 text-sm border rounded-full flex items-center gap-x-1 hover:border-blue-700 transition',
					!currentCategoryId && 'border-blue-700 bg-blue-100 text-blue-800',
				)}
			>
				All
			</button>

			{/* Dynamic Category Buttons */}
			{items.map(item => {
				const Icon = iconMap[item.name] || FcEngineering;
				const isSelected = currentCategoryId === item.id;

				return (
					<button
						key={item.id}
						onClick={() => onClick(item.id)}
						className={cn(
							'py-2 px-3 text-sm border rounded-full flex items-center gap-x-1 hover:border-blue-700 transition whitespace-nowrap',
							isSelected && 'border-blue-700 bg-blue-100 text-blue-800',
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
