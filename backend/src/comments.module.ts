import { Module } from '@nestjs/common';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './services/comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './models/comments/comment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema}])],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
