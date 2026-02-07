'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export const LogoutButton = () => {
	const router = useRouter();
	const supabase = createClient();

	const onLogout = async () => {
		await supabase.auth.signOut();
		router.push('/login');
		router.refresh();
	};

	return (
		<DropdownMenuItem
			onClick={onLogout}
			className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
		>
			<LogOut className="mr-2 h-4 w-4" />
			<span>Sign out</span>
		</DropdownMenuItem>
	);
};
