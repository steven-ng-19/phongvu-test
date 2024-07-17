import { Document, SchemaTypes, Types } from 'mongoose';
import { NotificationCondition, NotificationMethod } from 'src/shared/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PRODUCT_MODEL } from '../../products/models';
import { USER_MODEL } from '../../users/models';

export const WISH_MODEL = 'Wish';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Wish {
  @Prop({ type: SchemaTypes.ObjectId, ref: USER_MODEL })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: PRODUCT_MODEL })
  product: Types.ObjectId;

  @Prop({
    type: SchemaTypes.Mixed,
    default: { email: false, sms: false, pushNotification: false },
  })
  notificationMethod: NotificationMethod;

  @Prop({
    type: SchemaTypes.Mixed,
    default: { minPrice: 0, maxPrice: 0, hasPromotion: false, hasStock: false },
  })
  notificationCondition: NotificationCondition;
}

export const WishSchema = SchemaFactory.createForClass(Wish);
