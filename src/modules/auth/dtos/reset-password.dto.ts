import { z } from 'zod';

export const ResetPasswordValidator = z
  .object({
    token: z.string().trim(),
    newPassword: z.string().trim().min(8),
  })
  .strip();

export type ResetPasswordDto = z.infer<typeof ResetPasswordValidator>;
