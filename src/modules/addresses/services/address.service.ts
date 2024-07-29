import {
  Address,
  AddressFindByConditionParams,
  AddressFindByUniqueKeyParams,
  AddressFindManyByUniqueKeyParams,
  AddressPrimaryKey,
  CreateAddressParams,
  UpdateAddressParams,
} from '../types';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ADDRESS_ERRORS } from 'src/common/contents/errors/address.error';
import { AddressDto } from '../dtos';
import { AddressMapper } from '../mappers';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { ClerkService } from 'src/shared/clerk/clerk.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ResponseFindMany } from 'src/common/types/respone-find-many.type';
import { ResponseSuccess } from 'src/common/types';
import { USER_ERRORS } from 'src/common/contents/errors/user.error';
import { UserService } from 'src/modules/users/services';

@Injectable()
export class AddressService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mapper: AddressMapper,
    private readonly _clerkService: ClerkService,
    private readonly _userService: UserService,
  ) {}

  async findOne(param: AddressFindByUniqueKeyParams): Promise<Address> {
    const mapperData = this._mapper.findByKey(param);
    const address = await this._prismaService.address.findFirst(mapperData);
    if (!address) throw new BadRequestException(ADDRESS_ERRORS.NOT_FOUND);
    return address;
  }

  async findOneByConditions(
    param: AddressFindByConditionParams,
  ): Promise<Address> {
    const mapperData = this._mapper.findByCondition(param);
    const address = await this._prismaService.address.findFirst(mapperData);
    if (!address) throw new BadRequestException(ADDRESS_ERRORS.NOT_FOUND);
    return address;
  }

  async create(data: CreateAddressParams): Promise<ResponseSuccess<Address>> {
    const { userId } = data;
    const user = this._userService.findOne({ id: userId });

    const mapperData = this._mapper.create(data);
    const address = await this._prismaService.address.create(mapperData);
    return {
      success: true,
      data: address,
    };
  }

  async update(
    param: AddressPrimaryKey,
    data: UpdateAddressParams,
  ): Promise<ResponseSuccess<Address>> {
    const existAddress = await this.findOne(param);
    const mapperData = this._mapper.update(param, data);
    const address = await this._prismaService.address.update(mapperData);
    return {
      success: true,
      data: address,
    };
  }

  async delete(param: AddressPrimaryKey): Promise<ResponseSuccess<Address>> {
    const mapperData = this._mapper.delete(param);
    const address = await this._prismaService.address.delete(mapperData);
    return {
      success: true,
    };
  }

  async findAllByKey(
    param: BaseQueryParamsDto<AddressDto>,
  ): Promise<ResponseFindMany<Address>> {
    const mapperData = this._mapper.findManyByKey(param);
    const countData = this._mapper.count(param.findOptions.where);
    const address = await this._prismaService.address.findMany(mapperData);
    const count = await this._prismaService.address.count(countData);
    return {
      data: address,
      count,
    };
  }

  async setDefault(
    param: AddressFindByUniqueKeyParams,
  ): Promise<ResponseSuccess<Address>> {
    const address = await this.findOne(param);
    const mapperData = this._mapper.update(
      { id: address.id },
      { isDefault: true },
    );

    const result = await this._prismaService.address.update(mapperData);
    return {
      success: true,
      data: result,
    };
  }
}
