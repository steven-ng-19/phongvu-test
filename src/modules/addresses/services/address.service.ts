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

import { AddressDto } from '../dtos';
import { AddressMapper } from '../mappers';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { ClerkService } from 'src/shared/clerk/clerk.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
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

  async findOne(param: AddressFindByUniqueKeyParams): Promise<Address | null> {
    const mapperData = this._mapper.findByKey(param);
    const address = await this._prismaService.address.findFirst(mapperData);
    return address;
  }

  async findOneByConditions(
    param: AddressFindByConditionParams,
  ): Promise<Address | null> {
    const mapperData = this._mapper.findByCondition(param);
    const address = await this._prismaService.address.findFirst(mapperData);
    return address;
  }

  async create(data: CreateAddressParams): Promise<Address> {
    const { userId } = data;
    const user = this._userService.findOne({ id: userId });
    if (!user) throw new BadRequestException(USER_ERRORS.NOT_FOUND);
    const mapperData = this._mapper.create(data);
    const address = await this._prismaService.address.create(mapperData);
    return address;
  }

  async update(
    param: AddressPrimaryKey,
    data: UpdateAddressParams,
  ): Promise<Address> {
    const mapperData = this._mapper.update(param, data);
    const address = await this._prismaService.address.update(mapperData);
    return address;
  }

  async delete(param: AddressPrimaryKey): Promise<Address> {
    const mapperData = this._mapper.delete(param);
    const address = await this._prismaService.address.delete(mapperData);
    return address;
  }

  async findAllByKey(
    param: BaseQueryParamsDto<AddressDto>,
  ): Promise<{ data: Address[]; count: number }> {
    const mapperData = this._mapper.findManyByKey(param);
    const countData = this._mapper.count(param.findOptions.where);
    const address = await this._prismaService.address.findMany(mapperData);
    const count = await this._prismaService.address.count(countData);
    return {
      data: address,
      count,
    };
  }
}
