'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const schema = z.object({
	description: z.string().min(1),
});

export const DescriptionForm = ({
	courseId,
	initialData,
}: {
	courseId: string;
	initialData: { description: string | null };
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { description: initialData?.description || '' },
	});

	const onSubmit = async (values: z.infer<typeof schema>) => {
		try {
			await supabase.from('courses').update(values).eq('id', courseId);
			setIsEditing(false);
			router.refresh();
		} catch {
			console.error('Update failed');
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course description
				<Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
					{isEditing ? (
						'Cancel'
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" /> Edit
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						'text-sm mt-2',
						!initialData.description && 'text-slate-500 italic',
					)}
				>
					{initialData.description || 'No description provided'}
				</p>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											disabled={form.formState.isSubmitting}
											placeholder="e.g. 'This course is about...'"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={form.formState.isSubmitting} type="submit">
							Save
						</Button>
					</form>
				</Form>
			)}
		</div>
	);
};
