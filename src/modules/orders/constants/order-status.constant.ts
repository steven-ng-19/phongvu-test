import { OrderStatus } from '../enums';

export const ALLOWED_STATUS_ADMIN = {
  [OrderStatus.PENDING]: [
    OrderStatus.CANCELLED,
    OrderStatus.AWAITING_SHIPMENT,
    OrderStatus.PAID,
  ],
  [OrderStatus.PAID]: [OrderStatus.AWAITING_SHIPMENT, OrderStatus.CANCELLED],
  [OrderStatus.AWAITING_SHIPMENT]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
} as const;

export const ALLOWED_STATUS_USER = {
  [OrderStatus.PENDING]: [OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [],
  [OrderStatus.AWAITING_SHIPMENT]: [],
  [OrderStatus.SHIPPED]: [],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
} as const;
