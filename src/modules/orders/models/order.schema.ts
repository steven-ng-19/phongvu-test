import { OrderItem, OrderItemSchema } from '.';
import { OrderStatus, PaymentMethod } from 'src/common/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

import { Address } from '../../users/models';
import { USER_MODEL } from '../../users/models/user.schema';

export const ORDER_MODEL = 'Order';
export type OrderDocument = Order & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: USER_MODEL })
  user: Types.ObjectId;

  @Prop({ type: [OrderItemSchema] })
  items: OrderItem[];

  @Prop({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop()
  totalPrice: number;

  @Prop({ default: PaymentMethod.CREDIT_CARD })
  paymentMethod: PaymentMethod;

  @Prop()
  paymentId: string;

  @Prop({ type: SchemaTypes.Mixed })
  paymentDetails: any;

  @Prop({ type: SchemaTypes.Mixed })
  address: Address;

  @Prop()
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
