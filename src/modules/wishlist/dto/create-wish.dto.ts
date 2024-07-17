import { z } from 'zod';

export const CreateWishValidator = z.object({
  productId: z.string({
    required_error: 'Product ID is required',
    invalid_type_error: 'Product ID must be string',
  }),
  notificationMethod: z.object({
    email: z.boolean().default(false),
    sms: z.boolean().default(false),
    pushNotification: z.boolean().default(false),
  }),
  notificationCondition: z.object({
    minPrice: z.number().default(0),
    maxPrice: z.number().default(0),
    hasPromotion: z.boolean().default(false),
    hasStock: z.boolean().default(false),
  }),
});

export type CreateWishDto = z.infer<typeof CreateWishValidator>;
