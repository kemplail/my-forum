import { Controller, Post, Body, Get, Param, Delete, Patch, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from '../dto/CreateUserDTO';
import { UserService } from '../services/user.service';
import { User } from '../models/users/user.schema';
import { IdParam } from '../dto/IdParam';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createPostDTO : CreateUserDto): Promise<User> {
        return this.userService.create(createPostDTO);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param() param: IdParam) {
        return this.userService.findOne(param);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteOne(@Request() req, @Param() param: IdParam) {
        return this.userService.deleteOne(param);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Request() req, @Param() param: IdParam, @Body() updateUserdto: CreateUserDto) {
        return this.userService.update(param,updateUserdto);
    }

}
