import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchDTO {
  @ApiProperty()
  @IsString()
  query: string;
}
