import { BadRequestException, Injectable } from '@nestjs/common';

import { ADDRESS_ERRORS } from 'src/common/contents/errors/address.error';
import { AddressService } from 'src/modules/addresses/services';
import { CART_ITEM_ERRORS } from 'src/common/contents/errors/cart-item.error';
import { CreateOrderDto } from '../dtos';
import { ORDER_ERRORS } from 'src/common/contents/errors/order.error';
import { Order } from '@prisma/client';
import { OrderMapper } from '../mappers';
import { PRODUCT_ERRORS } from 'src/common/contents/errors/product.error';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ProductService } from 'src/modules/products/services';
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
    clerkId: string,
  ): Promise<ResponseSuccess<Order>> {
    const { orderItems, addressId, ...rest } = data;
    const existUser = await this._userService.findOneByConditions({ clerkId });
    let productTotalPrice = 0;

    const ids = orderItems.map((item) => item.productId);
    const checkProduct = await this._productService.checkProduct({ ids });
    if (checkProduct.notFoundProduct > 0)
      throw new BadRequestException(PRODUCT_ERRORS.NOT_FOUND);

    const orderItemsData = orderItems.map((item) => {
      const product = checkProduct.products.find(
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
      console.log(totalPriceWithDiscount);
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
      throw new BadRequestException(ORDER_ERRORS.ORDER_TOTAL_PRICE_INCORECT);

    const address = await this._addressService.findOneByConditions({
      userId: existUser.id,
      id: addressId,
    });
    const { user, ...addressData } = address;

    if (!address) throw new BadRequestException(ADDRESS_ERRORS.NOT_FOUND);
    console.log(orderItems);
    const mapperData = this._mapper.create({
      ...rest,
      userId: existUser.id,
      addressData,
      orderItems: orderItemsData,
    });
    const order = await this._prismaService.order.create(mapperData);
    return {
      success: true,
      data: order,
    };
  }
}
