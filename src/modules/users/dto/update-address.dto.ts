import { CreateAddressValidator } from './create-address.dto';
import { z } from 'zod';

export const UpdateAddressSchema = CreateAddressValidator.partial().strict();

export type UpdateAddressDto = z.infer<typeof UpdateAddressSchema>;
