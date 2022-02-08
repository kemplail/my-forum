import { IsEmail, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    password: string;
}