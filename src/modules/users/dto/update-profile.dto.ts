import { Gender } from 'src/common/enums';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { z } from 'zod';

const genderEnumValues = Object.values(Gender) as [string, ...string[]];
export const UpdateProfileValidator = z
  .object({
    phone: z
      .string({ invalid_type_error: 'Phone must be string' })
      .trim()
      .refine((phone) => {
        const phoneNumber = parsePhoneNumber(phone);
        return phoneNumber.valid ? phoneNumber.number : null;
      }),
    firstName: z
      .string({ invalid_type_error: 'First name must be string' })
      .trim(),
    lastName: z
      .string({ invalid_type_error: 'Last name must be string' })
      .trim(),
    avatar: z
      .string({ invalid_type_error: 'Avatar must be string' })
      .trim()
      .url({ message: 'Invalid URL' }),
    cover: z.string({ invalid_type_error: 'Cover must be string' }).trim(),
    dob: z.date(),
    gender: z.enum(genderEnumValues),
  })
  .partial()
  .strict();

export type UpdateProfileDto = z.infer<typeof UpdateProfileValidator>;
