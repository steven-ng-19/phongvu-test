import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export const CONDITION_MODEL = 'Condition';

@Schema({ _id: false, timestamps: false })
export class Condition {
  @Prop()
  orderValueMin: number;

  @Prop()
  orderValueMax: number;

  @Prop()
  minQuantity: number;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);
