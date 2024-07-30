import { CreatePromotionValidator } from './create-promotion.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdatePromotionValidator = CreatePromotionValidator.partial();

export class UpdatePromotionDto extends createZodDto(
  UpdatePromotionValidator,
) {}
