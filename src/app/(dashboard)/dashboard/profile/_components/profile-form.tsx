'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formSchema = z.object({
	full_name: z.string().min(2, 'Name must be at least 2 characters'),
	avatar_url: z.string().optional(),
});

interface ProfileFormProps {
	user: User;
	initialData: {
		full_name: string | null;
		avatar_url: string | null;
	};
}

export const ProfileForm = ({ user, initialData }: ProfileFormProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			full_name: initialData.full_name || '',
			avatar_url: initialData.avatar_url || '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setIsLoading(true);
			const { error } = await supabase.from('profiles').upsert({
				id: user.id,
				full_name: values.full_name,
				avatar_url: values.avatar_url,
				updated_at: new Date().toISOString(),
			});

			if (error) throw error;
			router.refresh();
		} catch (error) {
			console.error('Profile update failed', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
				<div className="flex items-center gap-x-4">
					<Avatar className="h-20 w-20">
						<AvatarImage src={form.getValues('avatar_url')} />
						<AvatarFallback>
							{initialData.full_name?.charAt(0) || 'U'}
						</AvatarFallback>
					</Avatar>
					{/* You could add an ImageUpload component here like we did for courses */}
				</div>

				<FormField
					control={form.control}
					name="full_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Display Name</FormLabel>
							<FormControl>
								<Input disabled={isLoading} placeholder="John Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button disabled={isLoading} type="submit">
					Save Changes
				</Button>
			</form>
		</Form>
	);
};
