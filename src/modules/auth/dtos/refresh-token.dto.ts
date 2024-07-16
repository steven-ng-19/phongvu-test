import { z } from 'zod';

export const RefreshTokenValidator = z
  .object({
    refreshToken: z.string().trim(),
  })
  .strip();

export type RefreshTokenDto = z.infer<typeof RefreshTokenValidator>;
