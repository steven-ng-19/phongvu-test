import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PromotionService } from '../services';
import { ZodValidationPipe } from 'src/common/pipes';
import { CreatePromotionDto, CreatePromotionValidator } from '../dto';
import { PromotionQueryParams } from 'src/shared/types';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('admin/promotions')
export class AdminPromotionController {
  constructor(private promotionsService: PromotionService) {}

  @Post()
  async createPromotion(
    @Body(new ZodValidationPipe(CreatePromotionValidator))
    data: CreatePromotionDto,
  ) {
    return await this.promotionsService.createPromotion(data);
  }

  @Get()
  async getPromotions(@Query() query: PromotionQueryParams) {
    return this.promotionsService.getPromotions(query);
  }

  @Get(':promotionId')
  async getPromotion(@Param('promotionId') promotionId: string) {
    return this.promotionsService.getPromotion(promotionId);
  }

  @Delete(':promotionId')
  async deletePromotion(@Param('promotionId') promotionId: string) {
    return this.promotionsService.deletePromotion(promotionId);
  }
}
