import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdvancedSearchDTO } from './AdvancedSearchDTO';
import {
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class WeightsDTO {
  @ApiPropertyOptional({ minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  semantic: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  text: number;
}

export class HybridSearchDTO extends AdvancedSearchDTO {
  @ApiPropertyOptional({ type: WeightsDTO })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeightsDTO)
  weights?: WeightsDTO;
}
