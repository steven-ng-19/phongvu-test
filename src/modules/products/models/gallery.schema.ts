import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export const GALLERY_MODEL = 'Gallery';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Gallery {
  @Prop()
  label: string;

  @Prop()
  url: string;

  @Prop()
  type: string;

  @Prop({ default: 1 })
  order: number;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
