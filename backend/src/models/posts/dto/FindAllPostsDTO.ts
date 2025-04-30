import { ApiProperty } from '@nestjs/swagger';
import { QueryPaginationDTO } from './QueryPaginationDTO';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllPostsDTO extends QueryPaginationDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Type(() => String)
  query: string;
}
