import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDTO {
    @ApiProperty()
    @IsString()
    title: string;
    @ApiProperty()
    @IsString()
    text:string;
    @ApiProperty()
    @IsMongoId()
    author: string;
}