import { CreatePostDTO } from '../dto/CreatePostDTO';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/*
export class UpdatePostDTO extends PartialType(
    OmitType(CreatePostDTO, ['author'] as const),
  ) {}

*/

export class UpdatePostDTO {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  text:string;
}