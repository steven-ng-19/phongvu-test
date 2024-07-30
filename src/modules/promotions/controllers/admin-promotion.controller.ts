import { Body, Controller, Post } from '@nestjs/common';
import { PromotionService } from '../services';
import { ZodValidationPipe } from 'src/common/pipes';
import { CreatePromotionDto, CreatePromotionValidator } from '../dtos';

@Controller('admin/promotions')
export class AdminPromotionController {
  constructor(private readonly _promotionService: PromotionService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreatePromotionValidator))
    data: CreatePromotionDto,
  ) {
    return this._promotionService.create(data);
  }
}
