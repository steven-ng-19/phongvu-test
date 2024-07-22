import { UserEntity } from '../entities';
import { createZodDto } from 'nestjs-zod';

export const UpdateUserValidator = UserEntity.pick({
  avatar: true,
  cover: true,
  dob: true,
  firstName: true,
  lastName: true,
  phone: true,
  gender: true,
});

export class UpdateUserDto extends createZodDto(UpdateUserValidator) {}
