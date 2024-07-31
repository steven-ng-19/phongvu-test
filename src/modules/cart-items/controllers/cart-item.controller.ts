import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { CartItemService } from '../services';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CART_ITEM_FILTER_FIELDS } from '../constants';
import { Prisma } from '@prisma/client';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { Request } from 'express';
import { ResponseService } from 'src/shared/response/response.service';
import { ClerkAuthGuard } from 'src/modules/auth/guards';
import { RequestUser } from 'src/common/decorators';
import { ClerkPayload } from 'src/modules/auth/types';
import {
  CreateCartItemDto,
  CreateCartItemValidator,
  UpdateCartItemValidator,
} from '../dtos';
import { ZodValidationPipe } from 'src/common/pipes';

@Controller('cart-items')
export class CartItemController {
  constructor(private readonly _cartItemService: CartItemService) {}

  @Get()
  @UseGuards(ClerkAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @RequestUser() user: ClerkPayload,
    @Req() req: Request,
    @Query(
      new DirectFilterPipe<any, Prisma.CartItemWhereInput>(
        [...CART_ITEM_FILTER_FIELDS],
        ['user.clerkId'],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    query: BaseQueryParamsDto<Prisma.CartItemWhereInput>,
  ) {
    const { findOptions, ...rest } = query;
    findOptions.where = {
      ...findOptions.where,
      userId: user.localId,
    };
    const { count, data } = await this._cartItemService.findAll(query);
    return ResponseService.paginateResponse({ data, count, query: rest, req });
  }

  @Get(':id')
  @UseGuards(ClerkAuthGuard)
  async findOne(@RequestUser() user: ClerkPayload, @Param('id') id: string) {
    return this._cartItemService.findOne({ id }, user.localId);
  }

  @Post()
  @UseGuards(ClerkAuthGuard)
  async create(
    @RequestUser() user: ClerkPayload,
    @Body(new ZodValidationPipe(CreateCartItemValidator))
    data: CreateCartItemDto,
  ) {
    return this._cartItemService.create(data, user.localId);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  async update(
    @RequestUser() user: ClerkPayload,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCartItemValidator))
    data: CreateCartItemDto,
  ) {
    return this._cartItemService.update({ id }, data, user.localId);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  async delete(@Param('id') id: string) {
    return this._cartItemService.delete({ id });
  }
}
