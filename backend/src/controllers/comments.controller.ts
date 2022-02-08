import { Controller, Get, Body, Post, Param, Delete, Patch } from '@nestjs/common';
import { CommentsService } from 'src/services/comments.service';
import { CreateCommentDTO } from 'src/dto/CreateCommentDTO';
import { IdParam } from 'src/dto/IdParam';
import { UpdateCommentDTO } from 'src/dto/UpdateCommentDTO';

@Controller('comments')
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    async create(@Body() createCommentDTO: CreateCommentDTO) {
        return this.commentsService.create(createCommentDTO);
    }

    @Get()
    async findAll() {
        return this.commentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param() param: IdParam) {
        return this.commentsService.findOne(param);
    }

    @Delete(':id')
    async delete(@Param() param: IdParam) {
        return this.commentsService.delete(param);
    }

    @Patch(':id')
    async update(@Body() updateCommentDTO : UpdateCommentDTO, @Param() param: IdParam) {
        return this.commentsService.update(updateCommentDTO, param);
    }

    @Get('/post/:id')
    async findAllCommentsOfAPost(@Param() param: IdParam) {
        return this.commentsService.findAllCommentsOfAPost(param);
    }

    @Get('/user/:id')
    async findAllCommentsOfAnUser(@Param() param: IdParam) {
        return this.commentsService.findAllCommentsOfAnUser(param);
    }

}
