import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AddressService } from '../services';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { BaseQueryParamsDto } from 'src/common/dtos';
import {
  AddressDto,
  CreateAddressDto,
  CreateAddressValidator,
  FindAddressDto,
} from '../dtos';
import { ZodValidationPipe } from 'src/common/pipes';
import { ApiPaginateResponse } from 'src/shared/response/dtos';
import { Request } from 'express';
import { ResponseService } from 'src/shared/response/response.service';
import { ADDRESS_FILTER_FIELD } from '../constants';
import { ClerkAuthGuard } from 'src/modules/auth/guards';
import { RequestUser } from 'src/common/decorators';
import { ClerkPayload } from 'src/modules/auth/types';
import { AddressKeys } from '../entities';
import { Address } from '../types';

@Controller('addresses')
export class AddressController {
  constructor(private readonly _addressService: AddressService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(ClerkAuthGuard)
  async findAll(
    @RequestUser() user: ClerkPayload,
    @Req() req: Request,
    @Query(
      new DirectFilterPipe<any, FindAddressDto>(
        [...ADDRESS_FILTER_FIELD],
        [],
        [{ createdAt: 'desc' }, { id: 'asc' }],
      ),
    )
    param: BaseQueryParamsDto<FindAddressDto>,
  ): Promise<ApiPaginateResponse<Partial<Address>>> {
    const { findOptions, ...rest } = param;
    param.findOptions.where = {
      ...param.findOptions.where,
      user: { clerkId: user.userId },
    };
    const { data, count } = await this._addressService.findAllByKey({
      findOptions,
      ...rest,
    });
    return ResponseService.paginateResponse({
      count,
      data,
      query: rest,
      req,
    });
  }

  @Post()
  @UseGuards(ClerkAuthGuard)
  async create(
    @RequestUser() user: ClerkPayload,
    @Body(new ZodValidationPipe(CreateAddressValidator)) data: CreateAddressDto,
  ) {
    return this._addressService.create(data, user.localId);
  }

  @UseGuards(ClerkAuthGuard)
  @Post('set-default/:addressId')
  async setDefault(
    @RequestUser() user: ClerkPayload,
    @Param('addressId') addressId: string,
  ) {
    return this._addressService.setDefault({
      id: addressId,
      userId: user.localId,
    });
  }
}
