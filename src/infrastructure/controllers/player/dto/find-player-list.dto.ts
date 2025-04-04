import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { PaginationParams } from 'core/repositories';
export class FindPlayersDto implements PaginationParams {
  @ApiProperty()
  @IsInt()
  limit?: number;
}
