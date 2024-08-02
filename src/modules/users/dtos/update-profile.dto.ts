import { UserEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdateUserValidator = UserEntity.pick({
  avatar: true,
  userName: true,
  cover: true,
  dob: true,
  firstName: true,
  lastName: true,
  phone: true,
  gender: true,
  customerId: true,
}).partial();

export class UpdateUserDto extends createZodDto(UpdateUserValidator) {}
