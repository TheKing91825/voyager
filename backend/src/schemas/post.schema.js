import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1, "Content is required").max(2000, "Content too long"),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal(''))
});

export const validateCreatePost = (data) => createPostSchema.parse(data);
