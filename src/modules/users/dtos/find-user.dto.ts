import { UserEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const FindUserByIdValidator = UserEntity.pick({
  id: true,
});

export class FindUserByIdDto extends createZodDto(FindUserByIdValidator) {}
