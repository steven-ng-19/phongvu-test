import { CreateAddressValidator } from './create-address.dto';
import { z } from 'zod';

export const UpdateAddressValidator = CreateAddressValidator.partial().strict();

export type UpdateAddressDto = z.infer<typeof UpdateAddressValidator>;
