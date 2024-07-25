import { CreateAddressValidator } from './create-address.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdateAddressValidator = CreateAddressValidator.omit({
  userId: true,
}).partial();

export class UpdateAddressDto extends createZodDto(UpdateAddressValidator) {}
