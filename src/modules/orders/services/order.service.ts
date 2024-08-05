import { ADDRESS_ERRORS } from 'src/common/contents/errors/address.error';
import { CART_ITEM_ERRORS } from 'src/common/contents/errors/cart-item.error';
import { ORDER_ERRORS } from 'src/common/contents/errors/order.error';
import { PRODUCT_ERRORS } from 'src/common/contents/errors/product.error';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { ResponseSuccess } from 'src/common/types';
import { ResponseFindMany } from 'src/common/types/respone-find-many.type';
import { AddressService } from 'src/modules/addresses/services';
import { Address } from 'src/modules/addresses/types';
import { CartItemService } from 'src/modules/cart-items/services';
import { ProductService } from 'src/modules/products/services';
import { UserService } from 'src/modules/users/services';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { ALLOWED_STATUS_ADMIN, ALLOWED_STATUS_USER } from '../constants';
import { CreateOrderDto } from '../dtos';
import { Json } from '../entities';
import { OrderMapper } from '../mappers';
import {
  OrderFindByConditionParams,
  OrderFindByUniqueKeyParams,
  OrderPrimaryKey,
  UpdateOrderParams,
} from '../types';

@Injectable()
export class OrderService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mapper: OrderMapper,
    private readonly _userService: UserService,
    private readonly _productService: ProductService,
    private readonly _addressService: AddressService,
    private readonly _cartItemService: CartItemService,
  ) {}

  async create(
    data: CreateOrderDto,
    userId: string,
  ): Promise<ResponseSuccess<Order>> {
    const { orderItems, addressId, ...rest } = data;
    let productTotalPrice = 0;

    try {
      return await this._prismaService.$transaction(
        async (trx: Prisma.TransactionClient) => {
          const ids = orderItems.map((item) => item.productId);
          const checkProductMapper = this._productService.checkProductMapper({
            ids,
          });
          const checkProduct = await trx.product.findMany(checkProductMapper);

          const foundProduct = checkProduct.map((product) => product.id);
          const notFoundProduct = ids.filter(
            (id) => !foundProduct.includes(id),
          );

          if (notFoundProduct.length > 0)
            throw new BadRequestException(PRODUCT_ERRORS.NOT_FOUND);

          const orderItemsData = orderItems.map((item) => {
            const product = checkProduct.find(
              (product) => product.id === item.productId,
            );

            if (item.quantity > product!.quantity)
              throw new BadRequestException(CART_ITEM_ERRORS.QUANTITY_INVALID);

            const productDiscount = product!.discount
              ? Math.round(((product!.discount * product!.price) / 100) * 100) /
                100
              : 0;

            const totalPrice = product!.price * item.quantity;
            const totalPriceWithDiscount = totalPrice - productDiscount;

            productTotalPrice += totalPriceWithDiscount;

            return {
              ...item,
              totalPrice: totalPrice,
              totalPriceWithDiscount: totalPriceWithDiscount,
              discount: productDiscount,
              productData: product!,
            };
          });

          const address = await this._addressService.findOneByConditions({
            userId,
            id: addressId,
          });
          const { user, ...addressRest } = address;

          if (!address) throw new BadRequestException(ADDRESS_ERRORS.NOT_FOUND);

          await Promise.all(
            checkProduct.map(async (product) => {
              const productQuantity =
                product.quantity -
                orderItemsData.find((item) => item.productId === product.id)!
                  .quantity;
              const updateProductMapper =
                this._productService.updateProductMapper(
                  { id: product.id },
                  { quantity: productQuantity },
                );

              const cartItemMapper = this._cartItemService.deleteMapper({
                userId: userId,
                productId: product.id,
              });

              await trx.cartItem.deleteMany(cartItemMapper);
              await trx.product.update(updateProductMapper);
            }),
          );

          const mapperData = this._mapper.create({
            ...rest,
            userId,
            totalPrice: productTotalPrice,
            addressData: addressRest,
            orderItems: orderItemsData,
          });
          const order = await trx.order.create(mapperData);
          const { paymentDetails, addressData, ...orderRest } = order;
          return {
            success: true,
            data: {
              ...orderRest,
              addressData: addressData,
              paymentDetails: paymentDetails,
            },
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(
    param: BaseQueryParamsDto<OrderFindByConditionParams>,
  ): Promise<ResponseFindMany<Order>> {
    const mapperData = this._mapper.findAll(param);
    const orders = await this._prismaService.order.findMany(mapperData);
    const count = await this._prismaService.order.count({
      where: mapperData.where,
    });
    return {
      data: orders,
      count,
    };
  }

  async findOneByKey(
    param: OrderFindByUniqueKeyParams,
    userId: string,
  ): Promise<Order> {
    const mapperData = this._mapper.findOne({ ...param, userId });
    const order = await this._prismaService.order.findFirst(mapperData);
    if (!order) throw new BadRequestException(ORDER_ERRORS.NOT_FOUND);
    const { paymentDetails, addressData, ...orderRest } = order;
    return {
      ...orderRest,
      addressData: addressData,
      paymentDetails: paymentDetails,
    };
  }

  async findOneByConditions(param: OrderFindByConditionParams): Promise<Order> {
    const mapperData = this._mapper.findOneByCondition(param);
    const order = await this._prismaService.order.findFirst(mapperData);
    if (!order) throw new BadRequestException(ORDER_ERRORS.NOT_FOUND);
    const { paymentDetails, addressData, ...orderRest } = order;
    return {
      ...orderRest,
      addressData: addressData,
      paymentDetails: paymentDetails,
    };
  }

  async changeStatus(
    param: OrderPrimaryKey,
    data: UpdateOrderParams,
    userId?: string,
    isAdmin: boolean = false,
  ): Promise<ResponseSuccess<Order>> {
    if (!isAdmin && userId) {
      const existOrder = await this.findOneByKey(param, userId);
      if (!ALLOWED_STATUS_USER[existOrder.status].includes(data.status)) {
        throw new BadRequestException(ORDER_ERRORS.STATUS_INVALID);
      }
    }
    const existOrder = await this.findOneByConditions(param);
    if (!ALLOWED_STATUS_ADMIN[existOrder.status].includes(data.status)) {
      throw new BadRequestException(ORDER_ERRORS.STATUS_INVALID);
    }
    const mapperData = this._mapper.update(param, data);
    const updateOrder = await this._prismaService.order.update(mapperData);
    return {
      success: true,
    };
  }

  async delete(param: OrderPrimaryKey): Promise<ResponseSuccess<Order>> {
    return await this._prismaService.$transaction(async (trx) => {
      // NOTE: Not handle check logic in transaction
      const order = await trx.order.findFirst({
        where: param,
        include: { orderItems: true },
      });
      if (!order) throw new BadRequestException(ORDER_ERRORS.NOT_FOUND);
      await trx.order.update({
        where: param,
        data: {
          orderItems: { deleteMany: {} },
        },
      });
      const deleteMapperData = this._mapper.delete(param);
      await trx.order.delete(deleteMapperData);

      const { orderItems } = order;
      // NOTE: In transaction, promise all Not Working
      await Promise.all(
        orderItems.map(async (item) => {
          // NOTE: Not check with multiple request DB in for_loop
          const product = await trx.product.findFirst({
            where: { id: item.productId },
          });
          if (!product) throw new BadRequestException(PRODUCT_ERRORS.NOT_FOUND);
          const updateProductMapper = this._productService.updateProductMapper(
            { id: item.productId },
            { quantity: item.quantity + product.quantity },
          );
          await trx.product.update(updateProductMapper);
        }),
      );
      return {
        success: true,
      };
    });
  }
}
