'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce'; // We'll create this next

export const SearchInput = () => {
	const [value, setValue] = useState('');
	const debouncedValue = useDebounce(value);

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const current = new URLSearchParams(Array.from(searchParams.entries()));

		if (debouncedValue) {
			current.set('name', debouncedValue);
		} else {
			current.delete('name');
		}

		const query = current.toString();
		const url = `${pathname}${query ? `?${query}` : ''}`;

		router.push(url);
	}, [debouncedValue, router, pathname, searchParams]);

	return (
		<div className="relative w-full md:w-[300px]">
			<Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
			<Input
				onChange={e => setValue(e.target.value)}
				value={value}
				className="w-full pl-9 rounded-md bg-slate-100 focus-visible:ring-slate-200"
				placeholder="Search students..."
			/>
		</div>
	);
};
