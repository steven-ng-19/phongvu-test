import { AddressRelatedModel } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const AddressRelatedValidatorr = AddressRelatedModel;

export class AddressRelatedDto extends createZodDto(AddressRelatedValidatorr) {}
