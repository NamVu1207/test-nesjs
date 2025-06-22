import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export abstract class BaseSchema {
  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Date, required: false })
  deletedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  deletedBy?: Types.ObjectId;
}
