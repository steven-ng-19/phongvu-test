import { UserEntity } from 'src/modules/users/entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const LoginValidator = UserEntity.pick({
  email: true,
  password: true,
});

export class LoginDto extends createZodDto(LoginValidator) {}
