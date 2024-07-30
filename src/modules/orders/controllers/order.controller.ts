import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { RequestUser } from 'src/common/decorators';
import { ClerkPayload } from 'src/modules/auth/types';
import { ClerkAuthGuard } from 'src/modules/auth/guards';
import { CreateOrderDto, CreateOrderValidator } from '../dtos';
import { ZodValidationPipe } from 'src/common/pipes';

@Controller('orders')
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  async create(
    @RequestUser() user: ClerkPayload,
    @Body(new ZodValidationPipe(CreateOrderValidator)) data: CreateOrderDto,
  ) {
    return this._orderService.create(data, user.userId);
  }
}
