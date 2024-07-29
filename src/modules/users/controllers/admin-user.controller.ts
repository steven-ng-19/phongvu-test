import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserService } from '../services';
import { AdminClerkAuthGuard } from 'src/modules/auth/guards';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { UserDto } from '../dtos';
import { USER_FILTER_FIELD, USER_RELATION_FILTER_FIELD } from '../constants';
import { BaseQueryParamsDto } from 'src/common/dtos';
import { ResponseService } from 'src/shared/response/response.service';
import { Request } from 'express';

@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AdminClerkAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this._userService.findOne({ id });
  }

  // @UseGuards(AdminClerkAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getAll(
    @Req() req: Request,
    @Query(
      new DirectFilterPipe<any, UserDto>(
        [...USER_FILTER_FIELD],
        USER_RELATION_FILTER_FIELD,
        [{ createdAt: 'asc' }, { id: 'asc' }],
      ),
    )
    param: BaseQueryParamsDto<UserDto>,
  ) {
    console.log(param);
    const { data, count } = await this._userService.findAll(param);
    const { findOptions, ...rest } = param;
    return ResponseService.paginateResponse({ count, data, query: rest, req });
  }
}
