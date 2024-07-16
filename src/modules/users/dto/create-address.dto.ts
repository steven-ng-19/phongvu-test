import { parsePhoneNumber } from 'awesome-phonenumber';
import { z } from 'zod';

export const CreateAddressValidator = z
  .object({
    fullName: z
      .string({
        invalid_type_error: 'Full name must be string',
        required_error: 'Full name must be required',
      })
      .trim(),
    phone: z
      .string({ invalid_type_error: 'Phone must be string' })
      .trim()
      .refine((val) => {
        const phoneNumber = parsePhoneNumber(val);
        return phoneNumber.valid ? phoneNumber.number : null;
      }),
    address: z
      .string({
        required_error: 'Address is required',
        invalid_type_error: 'Address must be string',
      })
      .trim(),
    ward: z
      .string({ invalid_type_error: 'Ward must be string' })
      .trim()
      .optional(),
    district: z
      .string({ invalid_type_error: 'District must be string' })
      .trim()
      .optional(),
    city: z
      .string({ invalid_type_error: 'City must be string' })
      .trim()
      .optional(),
    country: z
      .string({ invalid_type_error: 'Country must be string' })
      .trim()
      .optional(),
    latitude: z
      .string({ invalid_type_error: 'Latitude must be string' })
      .trim()
      .optional(),
    longitude: z
      .string({ invalid_type_error: 'Longitude must be string' })
      .trim()
      .optional(),
    isDefault: z
      .boolean({ invalid_type_error: 'Default must be boolean' })
      .default(false),
  })
  .strip();

export type CreateAddressDto = z.infer<typeof CreateAddressValidator>;
