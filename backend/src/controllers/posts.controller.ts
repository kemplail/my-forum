import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { IdParam } from 'src/models/IdParam';
import { UpdatePostDTO } from '../models/posts/dto/UpdatePostDTO';
import { PostsService } from 'src/services/posts.service';
import { CreatePostDTO } from '../models/posts/dto/CreatePostDTO';
import { FindAllPostsDTO } from 'src/models/posts/dto/FindAllPostsDTO';
import { AdvancedSearchDTO } from 'src/models/posts/dto/AdvancedSearchDTO';
import { HybridSearchDTO } from 'src/models/posts/dto/HybridSearchDTO';
import { parse, SyntaxError } from 'src/parser/grammar';
import { SearchDTO } from 'src/models/posts/dto/SearchDTO';
import { LogicalCondition } from 'src/parser/types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query() queryParams: FindAllPostsDTO) {
    const params = FindAllPostsDTO.toFindAllPostsParams(queryParams);
    return this.postsService.findAll(params);
  }

  @Get('/semantic-search')
  async semanticSearch(@Query() queryParams: AdvancedSearchDTO) {
    return this.postsService.semanticSearch(queryParams);
  }

  @Post('/hybrid-search')
  async hybridSearch(@Body() body: HybridSearchDTO) {
    return this.postsService.hybridSearch(body);
  }

  @Get('/parse')
  parseQuery(@Query() queryParams: SearchDTO) {
    let query: LogicalCondition;
    try {
      query = parse(queryParams.query);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new BadRequestException(
          SyntaxError.buildMessage(e.expected, e.found),
        );
      }

      throw e;
    }

    return query;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createPostDTO: CreatePostDTO) {
    return this.postsService.create(createPostDTO, req.user);
  }

  @Get(':id')
  async findOne(@Param() param: IdParam) {
    return this.postsService.findOne(param);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOne(@Request() req, @Param() param: IdParam) {
    return this.postsService.deleteOne(param, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Body() updatePostDTO: UpdatePostDTO,
    @Param() param: IdParam,
  ) {
    return this.postsService.update(updatePostDTO, param, req.user);
  }

  @Get('/user/:id')
  async getPostsOfAnUser(@Param() param: IdParam) {
    return this.postsService.getPostsOfAnUser(param);
  }
}
