import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateUserParams,
  User,
  UserFindByConditionParams,
  UserFindByUniqueKeyParams,
  UserPrimaryKey,
} from '../types';

import { AddressFindByUniqueKeyParams } from 'src/modules/addresses/types';
import { ClerkService } from 'src/shared/clerk/clerk.service';
import { UserJSON as ClerkUser } from '@clerk/clerk-sdk-node';
import { Gender } from 'src/common/enums';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { USER_ERRORS } from 'src/common/contents/errors/user.error';
import { UpdateUserDto } from '../dtos';
import { UserMapper } from '../mappers';

@Injectable()
export class UserService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mapper: UserMapper,
    private readonly _clerkService: ClerkService,
  ) {}

  async findOne(param: UserFindByUniqueKeyParams): Promise<User | null> {
    const mapperData = this._mapper.findByKey(param);
    const user = (await this._prismaService.user.findFirst(mapperData)) as User;

    return user;
  }

  async findOneByConditions(
    param: UserFindByConditionParams,
  ): Promise<User | null> {
    const mapperData = this._mapper.findByCondition(param);
    const user = (await this._prismaService.user.findFirst(mapperData)) as User;

    return user;
  }
  async update(
    param: UserFindByUniqueKeyParams,
    userData: UpdateUserDto,
  ): Promise<User> {
    const existUser = await this.findOne(param);
    if (!existUser) throw new BadRequestException(USER_ERRORS.NOT_FOUND);
    const mapperData = this._mapper.update({ id: existUser.id }, userData);
    const user = await this._prismaService.user.update(mapperData);

    return user;
  }

  async transfromData(data: ClerkUser): Promise<UpdateUserDto> {
    const userData: UpdateUserDto = {
      avatar: data.image_url,
      firstName: data.first_name ?? undefined,
      lastName: data.last_name,
      userName: data.username ?? undefined,
      phone:
        data.phone_numbers.find(
          (phone) => phone.id === data.primary_phone_number_id,
        )?.phone_number ?? undefined,
      dob: data.public_metadata.dob as Date,
      gender: data.public_metadata.gender as
        | Gender.FEMALE
        | Gender.MALE
        | Gender.OTHER,
    };
    console.log('userData: ', userData);
    return userData;
  }

  async create(data: CreateUserParams): Promise<User> {
    const mapperData = this._mapper.create(data);
    const user = (await this._prismaService.user.create(mapperData)) as User;
    return user;
  }

  async deleteUser(param: UserFindByUniqueKeyParams): Promise<User> {
    const existUser = await this.findOne(param);
    if (!existUser) throw new BadRequestException(USER_ERRORS.NOT_FOUND);
    const mapperData = this._mapper.delete({ id: existUser.id });
    const user = await this._prismaService.user.update(mapperData);
    return user;
  }
}
