import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { generateSlug } from 'src/common/utils';

export const CATEGORY_MODEL = 'Category';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Category {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre<Category>('save', async function (next: any) {
  this.slug = generateSlug(this.name);
  next();
});

CategorySchema.pre('findOneAndUpdate', async function (next: any) {
  const update: any = { ...this.getUpdate() };
  if (update.name) {
    update.slug = generateSlug(update.name);
    this.setUpdate(update);
  }

  next();
});
