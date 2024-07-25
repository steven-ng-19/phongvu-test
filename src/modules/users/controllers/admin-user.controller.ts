import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { UserService } from '../services';
import { AdminClerkAuthGuard } from 'src/modules/auth/guards';

@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AdminClerkAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this._userService.findOne({ id });
  }
}
