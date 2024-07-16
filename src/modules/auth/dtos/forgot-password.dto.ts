import { z } from 'zod';

export const ForgotPasswordValidator = z
  .object({
    email: z.string().trim().email().toLowerCase(),
  })
  .strip();

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordValidator>;
