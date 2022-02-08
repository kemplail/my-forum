import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDTO {
    @ApiProperty()
    text: string;
    @ApiProperty()
    @IsMongoId()
    author: string;
    @ApiProperty()
    @IsMongoId()
    post: string;
}