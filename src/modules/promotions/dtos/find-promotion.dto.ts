import { PromotionEntity } from '../entities';
import { createZodDto } from '@anatine/zod-nestjs';

export const FindPromotionValidator = PromotionEntity;

export class FindPromotionDto extends createZodDto(FindPromotionValidator) {}
