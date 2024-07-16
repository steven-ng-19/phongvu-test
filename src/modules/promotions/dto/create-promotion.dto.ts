import { z } from 'zod';

export const CreatePromotionValidator = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be string',
      })
      .trim(),
    description: z.string().trim().optional(),
    endDate: z.preprocess((val) => {
      if (val instanceof Date && !isNaN(val.getTime())) {
        return val;
      }
      return undefined;
    }, z.date()),
    isDefault: z.boolean().default(false),
    image: z.string().url().optional(),
    condition: z.object({
      orderValueMin: z.number().min(0).default(0).optional().nullable(),
      orderValueMax: z.number().min(0).default(0).optional().nullable(),
      minQuantity: z.number().min(1).default(1).optional().nullable(),
    }),
    benefit: z.object({
      discount: z
        .object({
          percent: z.number().min(0).max(100),
          maxAmount: z.number().min(0),
          flat: z.number().min(0),
          maxAmountPerOrder: z.number().min(0),
        })
        .optional(),
      gifts: z
        .array(
          z.object({
            sku: z.string().trim(),
            name: z.string().trim(),
            image: z.string().url(),
            quantity: z.number().min(0).default(0),
            maxQuantityPerOrder: z.number().min(0),
          }),
        )
        .optional(),
    }),
    applyOn: z.string().trim(),
  })
  .strip();

export type CreatePromotionDto = z.infer<typeof CreatePromotionValidator>;
