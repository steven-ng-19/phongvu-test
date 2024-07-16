import { Gender } from 'src/common/enums';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { z } from 'zod';

const genderEnumValues = Object.values(Gender) as [string, ...string[]];
export const RegisterValidator = z
  .object({
    email: z
      .string({
        invalid_type_error: 'Email must be string',
        required_error: 'Email is required',
      })
      .trim()
      .email({ message: 'Email is invalid' })
      .toLowerCase(),
    password: z
      .string({
        invalid_type_error: 'Password must be string',
        required_error: 'Password is required',
      })
      .trim()
      .min(8, { message: 'Password at least 8 character' }),
    phone: z
      .string({ invalid_type_error: 'Phone must be string' })
      .trim()
      .refine((phone) => {
        const phoneNumer = parsePhoneNumber(phone);
        return phoneNumer.valid ? phoneNumer.number : null;
      })
      .optional(),
    firstName: z
      .string({ invalid_type_error: 'First name must be string' })
      .trim()
      .optional(),
    lastName: z
      .string({ invalid_type_error: 'Last name must be string' })
      .trim()
      .optional(),
    dob: z.date().optional(),
    gender: z.enum(genderEnumValues).default(Gender.OTHER),
  })
  .strict();

export type RegisterDto = z.infer<typeof RegisterValidator>;
