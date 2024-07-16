import { GalleryValidator } from './gallery.dto';
import { WarrantyValidator } from './warranty.dto';
import { z } from 'zod';

export const CreateProductValidator = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be string',
      })
      .trim(),
    description: z.string().trim().optional(),
    sku: z
      .string({
        required_error: 'Sku is required',
        invalid_type_error: 'Sku must be string',
      })
      .trim(),
    price: z.number().min(0).default(0),
    image: z
      .string({
        required_error: 'Image is required',
        invalid_type_error: 'Image must be string',
      })
      .url({ message: 'Invalid url' }),
    galleries: z.array(GalleryValidator).default([]),
    category: z.string().trim().optional(),
    warranty: WarrantyValidator.required(),
  })
  .strip();

export type CreateProductDto = z.infer<typeof CreateProductValidator>;
