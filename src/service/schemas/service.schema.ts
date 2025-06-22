import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { BaseSchema } from 'src/schemas/base.schema';

@Schema()
export class Service extends BaseSchema {
  @Prop({ required: true, unique: true, maxlength: 100 })
  name: string;
  @Prop({ ref: 'SysImage', type: MongooseSchema.Types.ObjectId, index: true })
  imageId: Types.ObjectId;
  @Prop({
    ref: 'ServiceCategory',
    type: MongooseSchema.Types.ObjectId,
    index: true,
  })
  serviceCategoryId: Types.ObjectId;
}
