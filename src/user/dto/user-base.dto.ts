import { Exclude, Expose, Type } from 'class-transformer';
import { AddressOutputDto } from 'src/dto/address-output.dto';

@Exclude()
export class UserOutputDto {
  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  image: string;

  @Expose()
  @Type(() => AddressOutputDto)
  address: AddressOutputDto;
}
