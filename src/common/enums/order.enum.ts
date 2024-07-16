export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  AWAITING_SHIPMENT = 'awaiting_shipment',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BITCOIN = 'bitcoin',
  WALLET = 'wallet',
}
