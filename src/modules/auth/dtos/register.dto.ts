import * as Zod from 'zod';

import { UserEntity } from 'src/modules/users/entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const RegisterValidator = Zod.object({
  token: Zod.string().trim(),
  password: Zod.string().trim().optional(),
});

export class RegisterDto extends createZodDto(RegisterValidator) {}
