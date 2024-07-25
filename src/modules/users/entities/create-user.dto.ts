import { UserEntity } from './user.entity';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreateUserValidator = UserEntity.pick({
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  clerkId: true,
  avatar: true,
  gender: true,
  role: true,
  userName: true,
});

export class CreateUserDto extends createZodDto(CreateUserValidator) {}
