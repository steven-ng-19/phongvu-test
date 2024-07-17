import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WISH_MODEL } from '../models/wish.schema';
import { PRODUCT_MODEL } from 'src/modules/products/models';
import { WishDocument } from '../entities';
import { ProductDocument } from 'src/modules/products/entities';
import { CreateWishDto, EditWishDto } from '../dto';
import { User } from 'src/modules/users/models';
import { WishQueryParams } from 'src/shared/types';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(WISH_MODEL) private wishModel: Model<WishDocument>,
    @InjectModel(PRODUCT_MODEL) private productModel: Model<ProductDocument>,
  ) {}

  async createWish(data: CreateWishDto, user: User) {
    try {
      const { productId, ...wishData } = data;
      const product = await this.productModel.findById(productId).lean();
      if (!product) throw new Error('Product not found');

      return this.wishModel.findOneAndUpdate(
        { user: user._id, product: product._id },
        { ...wishData },
        { upsert: true, new: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getWishes(query?: WishQueryParams) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sort = { createdAt: 'desc' },
      where = {},
      populate = ['product'],
    } = query;

    const queryObj = {
      ...where,
      ...(search && {
        $or: [
          {
            'product.name': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'product.description': {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      }),
    };

    const [wishes, count] = await Promise.all([
      this.wishModel
        .find(queryObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(populate)
        .sort(sort)
        .lean(),
      this.wishModel.countDocuments(queryObj),
    ]);

    return {
      page,
      limit,
      totalRow: count,
      totalPage: Math.ceil(count / limit),
      data: wishes,
    };
  }

  async getWish(wishId: string, populate: string[] = ['product']) {
    return this.wishModel.findById(wishId).populate(populate).lean();
  }

  async editWish(wishId: string, data: EditWishDto) {
    return this.wishModel.findByIdAndUpdate(wishId, data, { new: true });
  }

  async deleteWish(wishId: string) {
    return this.wishModel.findByIdAndDelete(wishId);
  }
}
