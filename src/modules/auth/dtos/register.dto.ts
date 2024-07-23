import { UserEntity } from 'src/modules/users/entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const RegisterValidator = UserEntity.pick({
  email: true,
  password: true,
  userName: true,
  firstName: true,
  lastName: true,
  dob: true,
  phone: true,
});

export class RegisterDto extends createZodDto(RegisterValidator) {}
