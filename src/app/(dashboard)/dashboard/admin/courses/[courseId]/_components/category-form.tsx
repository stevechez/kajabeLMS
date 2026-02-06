'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combobox';

interface CategoryFormProps {
	initialData: {
		category_id: string | null;
	};
	courseId: string;
	options: { label: string; value: string }[];
}

const formSchema = z.object({
	category_id: z.string().min(1),
});

export const CategoryForm = ({
	initialData,
	courseId,
	options,
}: CategoryFormProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing(current => !current);

	const router = useRouter();
	const supabase = createClient();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			category_id: initialData?.category_id || '',
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const { error } = await supabase
				.from('courses')
				.update(values)
				.eq('id', courseId);

			if (error) throw error;

			toggleEdit();
			router.refresh();
		} catch {
			console.error('Something went wrong');
		}
	};

	const selectedOption = options.find(
		option => option.value === initialData.category_id,
	);

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course category
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit category
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						'text-sm mt-2',
						!initialData.category_id && 'text-slate-500 italic',
					)}
				>
					{selectedOption?.label || 'No category'}
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
							name="category_id"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Combobox options={options} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button disabled={!isValid || isSubmitting} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};
