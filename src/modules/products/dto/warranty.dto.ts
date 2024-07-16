import { z } from 'zod';

export const WarrantyValidator = z.object({
  months: z
    .number({
      required_error: 'Months is required',
      invalid_type_error: 'Months must be number',
    })
    .min(0),
  description: z.string().trim().optional(),
});
