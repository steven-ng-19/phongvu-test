import { z } from 'zod';

export const GalleryValidator = z.object({
  label: z.string().trim().optional(),
  url: z
    .string({
      required_error: 'Gallery url is required',
      invalid_type_error: 'Gallery url must be string',
    })
    .trim()
    .url(),
  type: z.enum(['image', 'video']).default('image'),
  order: z.number().default(0),
});
