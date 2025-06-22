import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AddressOutputDto {
  @Expose()
  countryName: string;

  @Expose()
  cityName: string;

  @Expose()
  district: string;

  @Expose()
  specifict: string;
}
