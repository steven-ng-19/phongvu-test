import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PRODUCT_MODEL } from 'src/modules/products/models';
import { PROMOTION_MODEL } from '../models';
import { PromotionDocument } from '../entities';
import { CreatePromotionDto } from '../dto';
import { PromotionQueryParams } from 'src/shared/types';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(PROMOTION_MODEL)
    private promotionModel: Model<PromotionDocument>,
  ) {}

  async createPromotion(data: CreatePromotionDto) {
    return await this.promotionModel.create(data);
  }

  async getPromotions(query: PromotionQueryParams) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sort = {
        createdAt: 'desc',
      },
      where = {},
    } = query;

    const queryObj: Record<string, unknown> = {
      ...where,
      name: { $regex: search, $options: 'i' },
    };

    const [promotions, count] = await Promise.all([
      this.promotionModel
        .find(queryObj, null, { limit, skip: (page - 1) * limit })
        .sort(sort)
        .lean(),

      this.promotionModel.countDocuments(queryObj),
    ]);

    return {
      page,
      limit,
      totalRow: count,
      totalPage: Math.ceil(count / limit),
      data: promotions,
    };
  }

  async getPromotion(id: string) {
    return await this.promotionModel.findById(id).lean();
  }

  async deletePromotion(id: string) {
    return await this.promotionModel.findByIdAndDelete(id).lean();
  }
}
