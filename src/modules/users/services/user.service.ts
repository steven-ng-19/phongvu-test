import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateUserParams,
  User,
  UserFindByConditionParams,
  UserFindByUniqueKeyParams,
  UserPrimaryKey,
} from '../types';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { USER_ERRORS } from 'src/common/contents/errors/user.error';
import { UpdateUserDto } from '../dtos';
import { UserMapper } from '../mappers';

@Injectable()
export class UserService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mapper: UserMapper,
  ) {}

  async findOne(param: UserFindByUniqueKeyParams): Promise<User | null> {
    const mapperData = this._mapper.findByKey(param);
    const user = await this._prismaService.user.findFirst(mapperData);

    return user;
  }

  async findOneByConditions(
    param: UserFindByConditionParams,
  ): Promise<User | null> {
    const mapperData = this._mapper.findByCondition(param);
    const user = await this._prismaService.user.findFirst(mapperData);

    return user;
  }
  async update(param: UserPrimaryKey, data: UpdateUserDto): Promise<User> {
    const mapperData = this._mapper.update(param, data);
    const existUser = await this.findOne(param);
    if (!existUser) throw new BadRequestException(USER_ERRORS.NOT_FOUND);
    const user = await this._prismaService.user.update(mapperData);

    return user;
  }

  async create(data: CreateUserParams): Promise<User> {
    const mapperData = this._mapper.create(data);
    const user = await this._prismaService.user.create(mapperData);
    return user;
  }
}
