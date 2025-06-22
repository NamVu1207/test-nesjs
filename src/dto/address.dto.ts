import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  countryName: string;

  @IsString()
  @IsNotEmpty()
  cityCode: string;

  @IsString()
  @IsNotEmpty()
  cityName: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  specifict: string;
}
