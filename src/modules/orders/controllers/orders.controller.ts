import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { OrdersService } from '../services';
import { ZodValidationPipe } from 'src/common/pipes';
import {
  CheckoutOrderDto,
  CheckoutOrderValidator,
  CreateOrderDto,
  CreateOrderValidator,
} from '../dto';
import { RequestUser } from 'src/common/decorators';
import { User } from 'src/modules/users/models';
import { OrderQueryParams } from 'src/shared/types';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @RequestUser() user: User,
    @Body(new ZodValidationPipe(CreateOrderValidator)) data: CreateOrderDto,
  ) {
    const { paymentMethodId, ...orderData } = data;
    const order = await this.ordersService.createOrder(orderData, user);

    if (!paymentMethodId) return order;

    return this.ordersService.checkoutOrder(
      order._id.toString(),
      paymentMethodId,
      user,
    );
  }

  @Get()
  async getOrders(@RequestUser() user: User, @Query() query: OrderQueryParams) {
    return this.ordersService.getOrders({
      ...query,
      where: { user: user._id },
    });
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.ordersService.getOrder(orderId);
  }

  @Put(':orderId/checkout')
  async checkoutOrder(
    @Req() req: Request,
    @Param('orderId') orderId: string,
    @Body(new ZodValidationPipe(CheckoutOrderValidator)) data: CheckoutOrderDto,
  ) {
    const { paymentMethodId } = data;
    return this.ordersService.checkoutOrder(
      orderId,
      paymentMethodId,
      req.user as User,
    );
  }
}
