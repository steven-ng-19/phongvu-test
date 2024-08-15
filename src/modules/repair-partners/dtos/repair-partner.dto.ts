import { RepairPartnerEntity } from '../entities';
import { createZodDto } from 'nestjs-zod';

export const RepairPartnerValidator = RepairPartnerEntity;

export class RepairPartnerDto extends createZodDto(RepairPartnerValidator) {}
