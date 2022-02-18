import { Controller, Get, Body, Post, Param, Delete, Patch, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from 'src/services/comments.service';
import { CreateCommentDTO } from 'src/dto/CreateCommentDTO';
import { IdParam } from 'src/dto/IdParam';
import { UpdateCommentDTO } from 'src/dto/UpdateCommentDTO';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

@Controller('comments')
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() createCommentDTO: CreateCommentDTO) {
        return this.commentsService.create(createCommentDTO, req.user);
    }

    @Get()
    async findAll() {
        return this.commentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param() param: IdParam) {
        return this.commentsService.findOne(param);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Request() req, @Param() param: IdParam) {
        return this.commentsService.delete(param, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Request() req, @Body() updateCommentDTO : UpdateCommentDTO, @Param() param: IdParam) {
        return this.commentsService.update(updateCommentDTO, param, req.user);
    }

    @Get('/post/:id')
    async findAllCommentsOfAPost(@Param() param: IdParam) {
        return this.commentsService.findAllCommentsOfAPost(param);
    }

    @Get('/post/nbComments/:id')
    async getNbCommentsOfAPost(@Param() param: IdParam) {
        return this.commentsService.getNbCommentsOfAPost(param);
    }

    @Get('/user/:id')
    async findAllCommentsOfAnUser(@Param() param: IdParam) {
        return this.commentsService.findAllCommentsOfAnUser(param);
    }

}
