import { AddressEntity } from '../entities';
import { UserEntity } from 'src/modules/users/entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const FindAddressValidator = AddressEntity.pick({
  id: true,
  userId: true,
  phone: true,
  address: true,
  fullName: true,
  city: true,
  district: true,
  ward: true,
  country: true,
  createdAt: true,
  deletedAt: true,
})
  .extend({
    user: UserEntity.pick({
      clerkId: true,
      customerId: true,
    }).partial(),
  })
  .partial();

export class FindAddressDto extends createZodDto(FindAddressValidator) {}
