import { AddressEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreateAddressValidator = AddressEntity.pick({
  address: true,
  city: true,
  country: true,
  district: true,
  fullName: true,
  phone: true,
  ward: true,
  userId: true,
  isDefault: true,
  lateitude: true,
  longitude: true,
}).partial({
  userId: true,
});

export class CreateAddressDto extends createZodDto(CreateAddressValidator) {}
