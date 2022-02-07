import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CreatePostDTO } from '../dto/CreatePostDTO';
import { UserService } from '../services/user.service';
import { User } from '../models/users/user.schema';

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
    async findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: string) {
        const deleted = this.userService.deleteOne(id);
    }

}
