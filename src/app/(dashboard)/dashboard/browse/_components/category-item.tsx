'use client';

import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface CategoryItemProps {
	label: string;
	value?: string;
}

export const CategoryItem = ({ label, value }: CategoryItemProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentCategoryId = searchParams.get('categoryId');
	const isSelected = currentCategoryId === value;

	const onClick = () => {
		const url = new URL(window.location.href);

		if (isSelected) {
			url.searchParams.delete('categoryId');
		} else {
			url.searchParams.set('categoryId', value || '');
		}

		router.push(url.pathname + url.search);
	};

	return (
		<button
			onClick={onClick}
			className={cn(
				'py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-blue-700 transition',
				isSelected && 'border-blue-700 bg-blue-100 text-blue-800',
			)}
			type="button"
		>
			<div className="truncate">{label}</div>
		</button>
	);
};
