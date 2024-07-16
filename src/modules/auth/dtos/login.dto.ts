import { z } from 'zod';

export const LoginValidator = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().trim().min(8),
  })
  .strip();

export type LoginDto = z.infer<typeof LoginValidator>;
