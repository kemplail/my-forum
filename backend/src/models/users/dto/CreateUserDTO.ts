import { IsEmail, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    username: string;
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsString()
    password: string;
}