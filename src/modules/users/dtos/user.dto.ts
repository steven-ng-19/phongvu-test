import { UserEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const UserValidator = UserEntity;

export class UserDto extends createZodDto(UserValidator) {}
