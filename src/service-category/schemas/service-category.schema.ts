import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { BaseSchema } from 'src/schemas/base.schema';

@Schema()
export class ServiceCategory extends BaseSchema {
  @Prop({ required: true, unique: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, maxlength: 500 })
  description: string;

  @Prop()
  imageUrl: string;
}

export type ServiceCategoryDocument = ServiceCategory & Document;
export const ServiceCategorySchema =
  SchemaFactory.createForClass(ServiceCategory);
ServiceCategorySchema.index({ name: 1 }, { unique: true });
