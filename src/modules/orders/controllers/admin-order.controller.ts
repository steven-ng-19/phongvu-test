import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard, RolesGuard } from 'src/modules/auth/guards';
import { OrdersService } from '../services';
import { OrderQueryParams, StatisticsQueryParams } from 'src/shared/types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('admin/orders')
export class AdminOrderController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async getOrders(@Query() query: OrderQueryParams) {
    return this.ordersService.getOrders(query, ['user']);
  }

  @Get('statistics')
  async getOrderStatistics(@Query() query: StatisticsQueryParams) {
    return this.ordersService.getOrderStatistics(query);
  }

  @Get('statistics/revenue')
  async getRevenueStatistics(@Query() query: StatisticsQueryParams) {
    return this.ordersService.getRevenueStatistics(query);
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.ordersService.getOrder(orderId, ['user']);
  }
}
