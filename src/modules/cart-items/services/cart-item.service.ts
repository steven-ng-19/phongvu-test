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

  async create(data: CreateCartItemDto): Promise<ResponseSuccess<CartItem>> {
    const { clerkId, ...rest } = data;
    const user = await this._userService.findOneByConditions({
      clerkId,
    });
    const product = await this._productService.findOne({
      id: rest.productId,
    });
    const exitsMapper = this._mapper.findOne({
      userId: user.id,
      productId: product.id,
    });
    const existCartItem =
      await this._prismaService.cartItem.findFirst(exitsMapper);
    if (existCartItem) {
      const result = await this.update(
        { id: existCartItem.id },
        { quantity: existCartItem.quantity + rest.quantity },
      );
      return {
        success: true,
        data: result.data,
      };
    }

    if (data.quantity > product.quantity)
      throw new BadRequestException(CART_ITEM_ERRORS.QUANTITY_INVALID);
    const mapperData = this._mapper.create({ ...rest, userId: user.id });
    const cartItem = await this._prismaService.cartItem.create(mapperData);
    return {
      success: true,
      data: cartItem,
    };
  }

  async update(
    param: CartItemPrimaryKey,
    data: UpdateCartItemParams,
    clerkId?: string,
  ): Promise<ResponseSuccess<CartItem>> {
    const user = await this._userService.findOneByConditions({
      clerkId,
    });
    const exitsMapper = this._mapper.findOne({ ...param, userId: user.id });
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
    clerkId?: string,
  ): Promise<CartItem> {
    const user = await this._userService.findOneByConditions({
      clerkId,
    });
    const mapperData = this._mapper.findOne({ ...param, userId: user.id });
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

  async delete(param: CartItemPrimaryKey): Promise<ResponseSuccess<CartItem>> {
    const mapperData = this._mapper.delete(param);
    const cartItem = await this._prismaService.cartItem.update(mapperData);
    return {
      success: true,
    };
  }
}