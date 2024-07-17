import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { UsersService } from '../services';
import { Roles } from 'src/common/decorators/roles.decorator';
import { StatisticsQueryParams } from 'src/shared/types';

@UseGuards(JwtAuthGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private usersService: UsersService) {}

  @Get('statistics')
  async getUserStatistics(@Query() query: StatisticsQueryParams) {
    return this.usersService.getUserStatistics(query);
  }
}
