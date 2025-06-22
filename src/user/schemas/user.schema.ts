import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Address, AddressSchema } from 'src/schemas/address.schema';
import { BaseSchema } from 'src/schemas/base.schema';

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, maxlength: 100 })
  firstName: string;

  @Prop({ required: true, maxlength: 100 })
  lastName: string;

  @Prop({ required: true, unique: true, maxlength: 100 })
  email: string;

  @Prop({ required: true, unique: true, maxlength: 20 })
  phone: string;

  @Prop()
  image: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  avatar: string;

  @Prop({ type: AddressSchema, required: true })
  address: Address;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
