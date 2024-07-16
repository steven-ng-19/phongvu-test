import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Product } from '../../products/models';
import { SchemaTypes } from 'mongoose';

export const ORDER_ITEM_MODEL = 'OrderItem';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class OrderItem {
  @Prop({ type: SchemaTypes.Mixed })
  product: Product;

  @Prop()
  quantity: number;

  @Prop()
  discount: number;

  @Prop()
  totalPrice: number; // product.price * quantity

  @Prop()
  totalPriceWithDiscount: number; // totalPrice - discount
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
