import { UserEntity } from 'src/modules/users/entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const ForgotPasswordValidator = UserEntity.pick({
  email: true,
});

export class ForgotPasswordDto extends createZodDto(ForgotPasswordValidator) {}
