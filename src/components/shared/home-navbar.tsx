import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

export const HomeNavbar = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<div className="h-16 border-b flex items-center bg-white shadow-sm sticky top-0 z-50 px-6">
			<div className="max-w-7xl mx-auto w-full flex items-center justify-between">
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center gap-x-2 hover:opacity-75 transition"
				>
					<div className="bg-blue-700 p-1.5 rounded-lg">
						<GraduationCap className="text-white h-6 w-6" />
					</div>
					<span className="font-bold text-xl tracking-tight text-slate-900 hidden md:block">
						Kajabi<span className="text-blue-700">Clone</span>
					</span>
				</Link>

				{/* Navigation Actions */}
				<div className="flex items-center gap-x-4">
					<Button variant="ghost" asChild className="hidden sm:flex">
						<Link href="/dashboard/browse">Browse</Link>
					</Button>

					{user ? (
						<Button size="sm" asChild>
							<Link href="/dashboard">Dashboard</Link>
						</Button>
					) : (
						<div className="flex items-center gap-x-2">
							<Button variant="ghost" size="sm" asChild>
								<Link href="/login">Log in</Link>
							</Button>
							<Button size="sm" asChild>
								<Link href="/login">Get Started</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
