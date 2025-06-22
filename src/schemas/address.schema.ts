import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  countryName: string;

  @Prop({ required: true })
  cityCode: string;

  @Prop({ required: true })
  cityName: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  specifict: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
