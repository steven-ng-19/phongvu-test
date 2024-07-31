import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { RequestUser } from 'src/common/decorators';
import { ClerkPayload } from 'src/modules/auth/types';
import { ClerkAuthGuard } from 'src/modules/auth/guards';
import { CreateOrderDto, CreateOrderValidator, OrderDto } from '../dtos';
import { ZodValidationPipe } from 'src/common/pipes';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { ORDER_FILTER_FIELDS } from '../constants';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { Prisma } from '@prisma/client';
import { ResponseService } from 'src/shared/response/response.service';
import { ApiPaginateResponse } from 'src/shared/response/dtos';
import { Request } from 'express';
import { Order, OrderFindByConditionParams } from '../types';

@Controller('orders')
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  async create(
    @RequestUser() user: ClerkPayload,
    @Body(new ZodValidationPipe(CreateOrderValidator)) data: CreateOrderDto,
  ) {
    return this._orderService.create(data, user.localId);
  }

  @Get()
  @UseGuards(ClerkAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Req() req: Request,
    @RequestUser() user: ClerkPayload,
    @Query(
      new DirectFilterPipe<any, OrderFindByConditionParams>(
        [...ORDER_FILTER_FIELDS],
        [],
        [{ createdAt: 'asc' }],
      ),
    )
    param: BaseQueryParamsDto<OrderFindByConditionParams>,
  ): Promise<ApiPaginateResponse<Partial<Order>>> {
    const { findOptions, ...rest } = param;
    findOptions.where = {
      ...findOptions.where,
      userId: user.localId,
    };

    const { data, count } = await this._orderService.findAll({
      findOptions,
      ...rest,
    });

    return ResponseService.paginateResponse({
      data,
      count,
      query: rest,
      req,
    });
  }
}
