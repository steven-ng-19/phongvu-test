import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AddressService } from '../services';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { BaseQueryParamsDto } from 'src/common/dtos';
import {
  Address,
  AddressFindByConditionParams,
  AddressFindByUniqueKeyParams,
  AddressFindManyByUniqueKeyParams,
} from '../types';
import { AddressDto, CreateAddressDto, CreateAddressValidator } from '../dtos';
import { ZodValidationPipe } from 'src/common/pipes';
import { ApiPaginateResponse } from 'src/shared/response/dtos';
import { Request } from 'express';
import { ResponseService } from 'src/shared/response/response.service';
import { ADDRESS_FILTER_FIELD } from '../constants';

@Controller('addresses')
export class AddressController {
  constructor(private readonly _addressService: AddressService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Req() req: Request,
    @Query(
      new DirectFilterPipe<any, AddressDto>(
        [...ADDRESS_FILTER_FIELD],
        [],
        [{ createdAt: 'asc' }, { id: 'asc' }],
      ),
    )
    param: BaseQueryParamsDto<AddressDto>,
  ): Promise<ApiPaginateResponse<Partial<Address>>> {
    console.log(param);
    const { data, count } = await this._addressService.findAllByKey(param);
    const { findOptions, ...rest } = param;
    return ResponseService.paginateResponse({ count, data, query: rest, req });
  }

  @Post(':userId')
  async create(
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(CreateAddressValidator)) data: CreateAddressDto,
  ) {
    return this._addressService.create({ ...data, userId });
  }

  @Post('set-default/:addressId')
  async setDefault(@Param('addressId') addressId: string) {
    return this._addressService.setDefault({ id: addressId });
  }
}
