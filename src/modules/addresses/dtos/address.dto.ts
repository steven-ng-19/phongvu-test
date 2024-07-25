import { AddressEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const AddressValidator = AddressEntity;

export class AddressDto extends createZodDto(AddressValidator) {}
