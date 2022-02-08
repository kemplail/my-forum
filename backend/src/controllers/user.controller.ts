import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { CreateUserDto } from '../dto/CreateUserDTO';
import { UserService } from '../services/user.service';
import { User } from '../models/users/user.schema';
import { IdParam } from '../dto/IdParam';

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

    @Delete(':id')
    async deleteOne(@Param() param: IdParam) {
        return this.userService.deleteOne(param);
    }

    @Patch(':id')
    update(@Param() param: IdParam, @Body() updateUserdto: CreateUserDto) {
        return this.userService.update(param,updateUserdto);
    }

}
