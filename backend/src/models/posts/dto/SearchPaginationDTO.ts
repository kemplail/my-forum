import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class SearchPaginationDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ enum: ['before', 'after'] })
  @ValidateIf((o) => o.paginationToken !== undefined)
  @IsIn(['before', 'after'])
  direction?: 'before' | 'after';

  @ApiPropertyOptional()
  @ValidateIf((o) => o.direction !== undefined)
  @IsString()
  paginationToken?: string;
}
