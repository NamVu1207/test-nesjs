import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class uploader {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // The image URL
  @Prop({ required: true, unique: true, maxlength: 500 })
  url: string;

  @Prop({ required: true, maxlength: 50 })
  originalName: string;

  // The public ID of the image in the cloud storage
  @Prop({ required: true, maxlength: 200 })
  publicId: string;

  @Prop({ required: true, maxlength: 50 })
  mimeType: string;

  // The type of file-cateegory (e.g., 'image', 'video', etc.)
  @Prop({ required: true, maxlength: 50 })
  type: string;

  // The image size in bytes
  @Prop({ required: true })
  size: number;

  // The hash of the image file for integrity checks
  @Prop({ required: true, maxlength: 100 })
  hash: string;
}

export type UploaderDocument = uploader & Document;
export const UploaderSchema = SchemaFactory.createForClass(uploader);
