import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from './_components/profile-form';

export default async function ProfilePage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return redirect('/');

	// Fetch profile data
	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', user.id)
		.single();

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<div className="flex flex-col gap-y-2">
				<h1 className="text-2xl font-medium">My Profile</h1>
				<p className="text-sm text-slate-500">
					Update how you appear to instructors and other students.
				</p>
			</div>
			<ProfileForm
				user={user}
				initialData={profile || { full_name: '', avatar_url: '' }}
			/>
		</div>
	);
}
