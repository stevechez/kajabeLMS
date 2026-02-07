import Link from 'next/link';
import {
	LayoutDashboard,
	Video,
	Users,
	Settings,
	CreditCard,
	GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const routes = [
	{ label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
	{ label: 'My Courses', icon: Video, href: '/dashboard/courses' },
	{ label: 'Students', icon: Users, href: '/dashboard/students' },
	{ label: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
	{ label: 'Settings', icon: Settings, href: '/dashboard/profile' }, // Updated to point to profile
];

export async function Sidebar() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fetch profile data for the footer
	const { data: profile } = await supabase
		.from('profiles')
		.select('full_name, avatar_url')
		.eq('id', user?.id)
		.single();

	return (
		<div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r">
			{/* Logo Section */}
			<div className="px-6 py-6">
				<Link href="/" className="flex items-center gap-x-2">
					<div className="bg-blue-600 p-1 rounded-md">
						<GraduationCap className="h-6 w-6 text-white" />
					</div>
					<h1 className="text-xl font-bold tracking-tight text-white">
						Kajabi<span className="text-blue-400">LMS</span>
					</h1>
				</Link>
			</div>

			{/* Navigation Links */}
			<div className="flex-1 px-3">
				{routes.map(route => (
					<Link
						key={route.href}
						href={route.href}
						className={cn(
							buttonVariants({ variant: 'ghost' }),
							'w-full justify-start hover:bg-white/10 mb-1 text-slate-300 hover:text-white transition',
						)}
					>
						<route.icon className="mr-3 h-5 w-5 text-blue-400" />
						{route.label}
					</Link>
				))}
			</div>

			{/* User Profile Footer */}
			<div className="p-4 border-t border-white/10 mt-auto bg-slate-950/50">
				<Link
					href="/dashboard/profile"
					className="flex items-center gap-x-3 hover:bg-white/5 p-2 rounded-lg transition group"
				>
					<Avatar className="h-9 w-9 border border-white/10">
						<AvatarImage src={profile?.avatar_url || ''} />
						<AvatarFallback className="bg-blue-600 text-white text-xs">
							{profile?.full_name?.charAt(0) ||
								user?.email?.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col truncate">
						<p className="text-sm font-medium truncate group-hover:text-blue-400 transition">
							{profile?.full_name || 'New Learner'}
						</p>
						<p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
