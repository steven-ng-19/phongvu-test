import { AddressEntity } from '../entities';
import { UserEntity } from 'src/modules/users/entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const AddressValidator = AddressEntity.extend({
  user: UserEntity.partial().optional(),
});

export class AddressDto extends createZodDto(AddressValidator) {}
