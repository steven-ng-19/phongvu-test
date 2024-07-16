import { z } from 'zod';

export const StripeSchema = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    name: z.string().min(2).max(50).trim(),
  })
  .required();
