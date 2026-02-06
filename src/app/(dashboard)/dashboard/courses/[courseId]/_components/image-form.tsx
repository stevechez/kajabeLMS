'use client';

import { useState } from 'react';
import { Pencil, PlusCircle, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ImageFormProps {
	courseId: string;
	initialData: {
		thumbnail_url: string | null;
	};
}

export const ImageForm = ({ courseId, initialData }: ImageFormProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	const toggleEdit = () => setIsEditing(current => !current);

	const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = e.target.files?.[0];
			if (!file) return;

			setIsUploading(true);

			const fileExt = file.name.split('.').pop();
			const fileName = `${courseId}-${Math.random()}.${fileExt}`;
			const filePath = `${fileName}`;

			// 1. Upload to Supabase Storage
			const { error: uploadError } = await supabase.storage
				.from('course-thumbnails')
				.upload(filePath, file);

			if (uploadError) throw uploadError;

			// 2. Get the Public URL
			const {
				data: { publicUrl },
			} = supabase.storage.from('course-thumbnails').getPublicUrl(filePath);

			// 3. Update the Course table
			const { error: updateError } = await supabase
				.from('courses')
				.update({ thumbnail_url: publicUrl })
				.eq('id', courseId);

			if (updateError) throw updateError;

			toggleEdit();
			router.refresh();
		} catch (error) {
			console.error('Upload failed', error);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && !initialData.thumbnail_url && (
						<>
							{' '}
							<PlusCircle className="h-4 w-4 mr-2" /> Add image{' '}
						</>
					)}
					{!isEditing && initialData.thumbnail_url && (
						<>
							{' '}
							<Pencil className="h-4 w-4 mr-2" /> Edit image{' '}
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!initialData.thumbnail_url ? (
					<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
						<ImageIcon className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<Image
							alt="Upload"
							fill
							className="object-cover rounded-md"
							src={initialData.thumbnail_url}
						/>
					</div>
				))}
			{isEditing && (
				<div className="mt-4">
					<div className="flex items-center justify-center w-full">
						<label className="flex flex-col items-center justify-center w-full h-60 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								{isUploading ? (
									<Loader2 className="h-10 w-10 text-slate-500 animate-spin" />
								) : (
									<>
										<PlusCircle className="h-10 w-10 text-slate-500 mb-3" />
										<p className="text-sm text-slate-500">
											Click to upload thumbnail
										</p>
									</>
								)}
							</div>
							<input
								type="file"
								className="hidden"
								onChange={onUpload}
								disabled={isUploading}
								accept="image/*"
							/>
						</label>
					</div>
					<div className="text-xs text-muted-foreground mt-4">
						16:9 aspect ratio recommended
					</div>
				</div>
			)}
		</div>
	);
};
