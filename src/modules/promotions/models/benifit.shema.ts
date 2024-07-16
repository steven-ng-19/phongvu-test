import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export const DISCOUNT_MODEL = 'Discount';
export const GIFT_MODEL = 'Gift';
export const BENIFIT_MODEL = 'Benifit';

@Schema({ _id: false, timestamps: false })
export class Discount {
  @Prop()
  percent: number;

  @Prop()
  maxAmount: number;

  @Prop()
  flat: number;

  @Prop()
  maxAmountPerOrder: number;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);

@Schema({ _id: false, timestamps: false })
export class Gift {
  @Prop()
  sku: string;

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  quantity: number;

  @Prop()
  maxQuantityPerOrder: number;
}

export const GiftSchema = SchemaFactory.createForClass(Gift);

@Schema({ _id: false, timestamps: false })
export class Benifit {
  @Prop({ type: DiscountSchema })
  discount: Discount;

  @Prop({ type: [GiftSchema] })
  gifts: Gift[];
}

export const BenifitSchema = SchemaFactory.createForClass(Benifit);
