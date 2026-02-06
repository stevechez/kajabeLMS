import * as z from 'zod';

export const courseSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required').optional(),
	price: z.coerce.number().min(0).optional(),
});
