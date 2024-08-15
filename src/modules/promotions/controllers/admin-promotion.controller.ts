import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { PromotionService } from '../services';
import { CreatePromotionDto, CreatePromotionValidator } from '../dtos';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('admin/promotions')
export class AdminPromotionController {
  constructor(private readonly _promotionService: PromotionService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async create(
    @Body()
    data: CreatePromotionDto,
  ) {
    return this._promotionService.create(data);
  }
}
