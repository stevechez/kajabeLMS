'use client';

import * as z from 'zod';
import { useState } from 'react';
import { Pencil, CircleDollarSign } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import type { Resolver } from 'react-hook-form';

const formSchema = z.object({
	price: z.coerce.number().min(0),
});

// Define the exact shape we want
interface PriceFormValues {
	price: number;
}

interface PriceFormProps {
	courseId: string;
	initialData: {
		price: number | null;
	};
}

export const PriceForm = ({ courseId, initialData }: PriceFormProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	const {
		control,
		handleSubmit,
		formState: { isSubmitting, isValid },
	} = useForm<PriceFormValues>({
		resolver: zodResolver(formSchema) as Resolver<PriceFormValues>,
		defaultValues: {
			price: initialData?.price || 0,
		},
	});

	const onSubmit = async (values: PriceFormValues) => {
		try {
			const { error } = await supabase
				.from('courses')
				.update({ price: values.price })
				.eq('id', courseId);

			if (error) throw error;

			setIsEditing(false);
			router.refresh();
		} catch (error) {
			console.error('Price update failed', error);
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course price
				<Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
					{isEditing ? (
						'Cancel'
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit price
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p className="text-sm mt-2 font-bold flex items-center">
					<CircleDollarSign className="h-4 w-4 mr-2 text-slate-500" />
					{initialData.price
						? `$${initialData.price.toLocaleString()}`
						: 'Free'}
				</p>
			)}
			{isEditing && (
				// LINE 86 (or around there): Ensure handleSubmit is used directly
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
					<div className="space-y-2">
						<Label htmlFor="price">Price</Label>
						<Controller
							name="price"
							control={control}
							render={({ field: { onChange, value, ...fieldProps } }) => (
								<>
									<Input
										{...fieldProps}
										value={value ?? ''}
										onChange={e => onChange(e.target.value)}
										id="price"
										type="number"
										step="0.01"
										disabled={isSubmitting}
										placeholder="Set a price for your course"
									/>
								</>
							)}
						/>
					</div>
					<div className="flex items-center gap-x-2">
						<Button disabled={!isValid || isSubmitting} type="submit">
							Save
						</Button>
					</div>
				</form>
			)}
		</div>
	);
};
