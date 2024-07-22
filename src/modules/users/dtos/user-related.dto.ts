import { UserRelatedModel } from '../entities/user-related-model.entity';
import { createZodDto } from 'nestjs-zod';

export const UserRelatedValidator = UserRelatedModel;

export class UserRelatedDto extends createZodDto(UserRelatedValidator) {}
