import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryPaginationDTO {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  pageSize: number;
}
