import { z } from 'zod';

export const CreateCategoryValidator = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be string',
    })
    .trim(),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be string',
    })
    .trim()
    .min(10, { message: 'Description at least 10 character' }),
  image: z
    .string({
      required_error: 'Image is required',
      invalid_type_error: 'Image must be string',
    })
    .trim(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategoryValidator>;
