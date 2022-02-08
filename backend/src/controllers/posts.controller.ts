import { Controller, Get, Body, Post, Param, Delete, Patch } from '@nestjs/common';
import { IdParam } from 'src/dto/IdParam';
import { UpdatePostDTO } from 'src/dto/UpdatePostDTO';
import { PostsService } from 'src/services/posts.service';
import { CreatePostDTO } from '../dto/CreatePostDTO';

@Controller('posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) {}

    @Get()
    async findAll() {
        return this.postsService.findAll();
    }

    @Post()
    async create(@Body() createPostDTO: CreatePostDTO) {
        return this.postsService.create(createPostDTO);
    }

    @Get(':id')
    async findOne(@Param() param: IdParam) {
        return this.postsService.findOne(param);
    }

    @Delete(':id')
    deleteOne(@Param() param: IdParam) {
        return this.postsService.deleteOne(param);
    }

    @Patch(':id')
    async update(@Body() updatePostDTO : UpdatePostDTO, @Param() param: IdParam) {
        return this.postsService.update(updatePostDTO, param);
    }

    @Get('/user/:id')
    async getPostsOfAnUser(@Param() param: IdParam) {
        return this.postsService.getPostsOfAnUser(param);
    }

}
