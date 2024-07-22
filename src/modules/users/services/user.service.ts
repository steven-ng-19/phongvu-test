import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserFindByUniqueKeyParams } from '../types';

import { PrismaService } from 'src/shared/prisma/prisma.service';
import { USER_ERRORS } from 'src/common/contents/errors/user.error';
import { UserMapper } from '../mappers';

@Injectable()
export class UserService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mapper: UserMapper,
  ) {}

  async findById(param: UserFindByUniqueKeyParams): Promise<User> {
    const mapperData = this._mapper.findById(param);
    const user = await this._prismaService.user.findFirst(mapperData);
    if (!user) throw new BadRequestException(USER_ERRORS.NOT_FOUND);

    return user;
  }
}
