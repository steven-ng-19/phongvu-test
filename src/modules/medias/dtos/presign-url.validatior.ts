import { BaseValidator } from 'src/common/validators';
import { z } from 'zod';

export const PresignedUrlValidator = BaseValidator.extend({
  key: z
    .string({
      required_error: 'Key is required',
      invalid_type_error: 'Key must be a string',
    })
    .trim()
    .max(30, { message: 'Max length must be less than 30 characters' }),
  type: z
    .string({
      required_error: 'Type is required',
      invalid_type_error: 'Type must be a string',
    })
    .trim()
    .max(20, { message: 'Max length must be less than 20 characters' }),
});

export type PresignedUrlDto = z.infer<typeof PresignedUrlValidator>;
