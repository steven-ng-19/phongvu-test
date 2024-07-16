import { BaseValidator } from 'src/common/validators';
import { z } from 'zod';

export const DeleteFileValidator = BaseValidator.extend({
  key: z
    .string({
      required_error: 'Key is required',
      invalid_type_error: 'Key must be string',
    })
    .max(30, { message: 'Max length must be less than 30 characters' })
    .trim(),
});

export type DeleteFileDto = z.infer<typeof DeleteFileValidator>;
