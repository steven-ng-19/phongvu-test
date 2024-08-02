import { BadRequestException, Injectable } from '@nestjs/common';
import { CartItem, Prisma } from '@prisma/client';
import {
  CartItemFindByCondition,
  CartItemFindByUniqueKey,
  CartItemPrimaryKey,
  UpdateCartItemParams,
} from '../types';

import { BaseQueryParamsDto } from 'src/common/dtos';
import { CART_ITEM_ERRORS } from 'src/common/contents/errors/cart-item.error';
import { CartItemMapper } from '../mappers';
import { CreateCartItemDto } from '../dtos';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ProductService } from 'src/modules/products/services';
import { ResponseFindMany } from 'src/common/types/respone-find-many.type';
import { ResponseSuccess } from 'src/common/types';
import { UserService } from 'src/modules/users/services';

@Injectable()
export class CartItemService {
  constructor(
    private readonly _mapper: CartItemMapper,
    private readonly _prismaService: PrismaService,
    private readonly _userService: UserService,
    private readonly _productService: ProductService,
  ) {}

  async create(
    data: CreateCartItemDto,
    userId: string,
  ): Promise<ResponseSuccess<CartItem>> {
    const product = await this._productService.findOne({
      id: data.productId,
    });
    const exitsMapper = this._mapper.findOne({
      userId,
      productId: product.id,
    });
    const existCartItem =
      await this._prismaService.cartItem.findFirst(exitsMapper);
    if (existCartItem) {
      const result = await this.update(
        { id: existCartItem.id },
        { quantity: existCartItem.quantity + data.quantity },
      );
      return {
        success: true,
        data: result.data,
      };
    }

    if (data.quantity > product.quantity)
      throw new BadRequestException(CART_ITEM_ERRORS.QUANTITY_INVALID);
    const mapperData = this._mapper.create({ ...data, userId });
    const cartItem = await this._prismaService.cartItem.create(mapperData);
    return {
      success: true,
      data: cartItem,
    };
  }

  async update(
    param: CartItemPrimaryKey,
    data: UpdateCartItemParams,
    userId?: string,
  ): Promise<ResponseSuccess<CartItem>> {
    const exitsMapper = this._mapper.findOne({ ...param, userId });
    const existCartItem =
      await this._prismaService.cartItem.findFirst(exitsMapper);
    if (!existCartItem)
      throw new BadRequestException(CART_ITEM_ERRORS.NOT_FOUND);
    const produc = await this._productService.findOne({
      id: existCartItem.productId,
    });
    if (data.quantity && data.quantity > produc.quantity)
      throw new BadRequestException(CART_ITEM_ERRORS.QUANTITY_INVALID);
    const mapperData = this._mapper.update(param, data);
    const cartItem = await this._prismaService.cartItem.update(mapperData);
    return {
      success: true,
      data: cartItem,
    };
  }

  async findOne(
    param: CartItemFindByUniqueKey | CartItemFindByCondition,
    userId?: string,
  ): Promise<CartItem> {
    const mapperData = this._mapper.findOne({ ...param, userId });
    const cartItem = await this._prismaService.cartItem.findFirst(mapperData);
    if (!cartItem) throw new BadRequestException(CART_ITEM_ERRORS.NOT_FOUND);
    return cartItem;
  }

  async findAll(
    param: BaseQueryParamsDto<Prisma.CartItemWhereInput>,
  ): Promise<ResponseFindMany<CartItem>> {
    const mapperData = this._mapper.findAll(param);
    const cartItems = await this._prismaService.cartItem.findMany(mapperData);
    const count = await this._prismaService.cartItem.count({
      where: mapperData.where,
    });
    return {
      data: cartItems,
      count,
    };
  }

  deleteMapper(param: CartItemFindByCondition): Prisma.CartItemDeleteManyArgs {
    return this._mapper.deleteByCondition(param);
  }

  async delete(param: CartItemPrimaryKey): Promise<ResponseSuccess<CartItem>> {
    const mapperData = this._mapper.delete(param);
    const cartItem = await this._prismaService.cartItem.update(mapperData);
    return {
      success: true,
    };
  }
}
