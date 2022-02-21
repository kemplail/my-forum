import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { request } from 'http';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { CreateLikeCommentDTO } from 'src/dto/CreateLikeCommentDTO';
import { CreateLikePostDTO } from 'src/dto/CreateLikePostDTO';
import { IdParam } from 'src/dto/IdParam';
import { LikesService } from 'src/services/likes.service';

@Controller('likes')
export class LikesController {

    constructor(private readonly likesService: LikesService) {}

    @Get('/post/:id')
    async findAllLikesOfAPost(@Param() param: IdParam) {
        return this.likesService.findAllLikesOfAPost(param);
    }

    @Get('/comment/:id')
    async findAllLikesOfAComment(@Param() param: IdParam) {
        return this.likesService.findAllLikesOfAComment(param);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/post/loggeduser/:id')
    async findLikeOfLoggedUserOfAPost(@Request() req, @Param() param: IdParam) {
        return this.likesService.findLikeOfLoggedUserOfAPost(param, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/comment/loggeduser/:id')
    async findLikeOfLoggedUserOfComment(@Request() req, @Param() param: IdParam) {
        return this.likesService.findLikeOfLoggedUserOfComment(param, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/post')
    async addLikeToAPost(@Request() req, @Body() createLikePostDTO : CreateLikePostDTO) {
        return this.likesService.addLikeToAPost(createLikePostDTO, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/comment')
    async addLikeToAComment(@Request() req, @Body() createLikeCommentDTO : CreateLikeCommentDTO) {
        return this.likesService.addLikeToAComment(createLikeCommentDTO, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/post/:id')
    async deleteLikeOfAPost(@Request() req, @Param() param: IdParam) {
        return this.likesService.deleteLikeOfAPost(param, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/comment/:id')
    async deleteLikeOfAComment(@Request() req, @Param() param: IdParam) {
        return this.likesService.deleteLikeOfAComment(param, req.user);
    }

}
