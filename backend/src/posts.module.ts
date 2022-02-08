import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { Post, PostSchema } from './models/posts/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema}])],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
