import { BadRequestException, Injectable } from '@nestjs/common';
import { Order, OrderFindByConditionParams } from '../types';

import { ADDRESS_ERRORS } from 'src/common/contents/errors/address.error';
import { Address } from 'src/modules/addresses/types';
import { AddressService } from 'src/modules/addresses/services';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { CART_ITEM_ERRORS } from 'src/common/contents/errors/cart-item.error';
import { CreateOrderDto } from '../dtos';
import { Json } from '../entities';
import { ORDER_ERRORS } from 'src/common/contents/errors/order.error';
import { OrderMapper } from '../mappers';
import { PRODUCT_ERRORS } from 'src/common/contents/errors/product.error';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ProductService } from 'src/modules/products/services';
import { ResponseFindMany } from 'src/common/types/respone-find-many.type';
import { ResponseSuccess } from 'src/common/types';
import { UserService } from 'src/modules/users/services';

@Injectable()
export class OrderService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mapper: OrderMapper,
    private readonly _userService: UserService,
    private readonly _productService: ProductService,
    private readonly _addressService: AddressService,
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
              ? (product!.discount * product!.price) / 100
              : 0;

            if (productDiscount !== item.discount)
              throw new BadRequestException(ORDER_ERRORS.DISCOUNT_INCORECT);

            const totalPrice = product!.price * item.quantity;
            if (totalPrice !== item.totalPrice)
              throw new BadRequestException(ORDER_ERRORS.TOTAL_PRICE_INCORECT);

            const totalPriceWithDiscount = totalPrice - productDiscount;

            if (totalPriceWithDiscount != item.totalPriceWithDiscount)
              throw new BadRequestException(
                ORDER_ERRORS.TOTAL_PRICE_WITH_DISCOUNT_INCORECT,
              );

            productTotalPrice += totalPriceWithDiscount;
            return {
              ...item,
              productData: product!,
            };
          });

          if (productTotalPrice != data.totalPrice)
            throw new BadRequestException(
              ORDER_ERRORS.ORDER_TOTAL_PRICE_INCORECT,
            );

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

              await trx.product.update(updateProductMapper);
            }),
          );

          const mapperData = this._mapper.create({
            ...rest,
            userId,
            addressData: addressRest,
            orderItems: orderItemsData,
          });
          const order = await trx.order.create(mapperData);
          const { paymentDetails, addressData, ...orderRest } = order;
          return {
            success: true,
            data: {
              ...orderRest,
              addressData: addressData as (Address & Json) | undefined,
              paymentDetails: paymentDetails as (string & Json) | undefined,
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
    const orderList = orders.map((order) => {
      const { paymentDetails, addressData, ...orderRest } = order;
      return {
        ...orderRest,
        addressData: addressData as (Address & Json) | undefined,
        paymentDetails: paymentDetails as (string & Json) | undefined,
      };
    });
    return {
      data: orderList,
      count,
    };
  }
}
