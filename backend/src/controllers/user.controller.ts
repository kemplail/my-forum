import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CreatePostDTO } from '../dto/CreatePostDTO';
import { UserService } from '../services/user.service';
import { User } from '../models/users/user.schema';
import { IdParam } from '../validation/IdParam';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createPostDTO : CreatePostDTO): Promise<User> {
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
        const deleted = this.userService.deleteOne(param);
    }

}
