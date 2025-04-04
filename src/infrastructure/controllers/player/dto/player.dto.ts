import { ApiProperty } from '@nestjs/swagger';
import { PlayerEntity } from 'core/entities/player.entity';

export class CountryDto {
  @ApiProperty()
  picture: string;
  @ApiProperty()
  code: string;
}
export class DataDto {
  @ApiProperty()
  rank: number;
  @ApiProperty()
  points: number;
  @ApiProperty()
  weight: number;
  @ApiProperty()
  height: number;
  @ApiProperty()
  age: number;
  @ApiProperty()
  last: number[];
}
export class PlayerDto implements PlayerEntity {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  shortname: string;
  @ApiProperty()
  sex: 'M' | 'F';
  @ApiProperty({ type: () => CountryDto })
  country: CountryDto;
  @ApiProperty()
  picture: string;
  @ApiProperty({ type: () => DataDto })
  data: DataDto;
}
