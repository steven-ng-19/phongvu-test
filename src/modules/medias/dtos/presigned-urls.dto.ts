import { BaseValidator } from 'src/common/validators';
import { z } from 'zod';

// export const PresignedUrlValidator = BaseValidator.keys({
//   key: Joi.string().trim().max(30).required().messages({
//     "string.base": "Key must be a string",
//     "string.max": "Max length must be less than 30 characters",
//     "any.required": "Key is required",
//   }),
//   type: Joi.string().trim().max(20).required().messages({
//     "string.base": "Type must be a string",
//     "string.max": "Max length must be less than 20 characters",
//     "any.required": "Type is required",
//   }),
// });
const BaseUrlsSchema = z.array(
  z.object({
    key: z
      .string({
        required_error: 'Key is required',
        invalid_type_error: 'Key must be a string',
      })
      .trim()
      .max(30, { message: 'Max length must be less than 30 characters' }),
    type: z
      .string({
        required_error: 'Content type is required',
        invalid_type_error: 'Type must be a string',
      })
      .trim()
      .max(20, { message: 'Max length must be less than 20 characters' }),
  }),
);

export const PresignedUrlsValidator = BaseValidator.extend({
  urls: BaseUrlsSchema.min(2, {
    message: 'The uploaded img array must have a length of at least 1',
  }).max(20, {
    message: 'The uploaded img array can have a maximum length of 20.',
  }),
});

export type PresignedUrlsDto = z.infer<typeof PresignedUrlsValidator>;
