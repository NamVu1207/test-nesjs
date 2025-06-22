import { Type } from 'class-transformer';
import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from 'src/dto/address.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  image: string;

  @IsISO8601()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsObject()
  @ValidateNested({ each: true }) // nếu là mảng lồng cần validate
  @Type(() => AddressDto)
  address: AddressDto[];
}
