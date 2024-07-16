import { Document, SchemaTypes, Types } from 'mongoose';
import { Gallery, GallerySchema } from '.';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CATEGORY_MODEL } from '../../categories/models/category.schema';
import { Warranty } from 'src/shared/types';
import { generateSlug } from 'src/common/utils';

export const PRODUCT_MODEL = 'Product';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Product {
  @Prop()
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop({ unique: true })
  sku: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 1 })
  quantity: number;

  @Prop()
  image: string;

  @Prop({ type: [GallerySchema] })
  galleries: Gallery[];

  @Prop({ type: SchemaTypes.ObjectId, ref: CATEGORY_MODEL })
  category: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed, default: { months: 1, description: '' } })
  warranty: Warranty;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre<Product>('save', async function (next: any) {
  this.slug = generateSlug(this.name);
  next();
});

ProductSchema.pre('findOneAndUpdate', async function (next: any) {
  const update: any = { ...this.getUpdate() };
  if (update.name) {
    update.slug = generateSlug(update.name);
    this.setUpdate(update);
  }

  next();
});
