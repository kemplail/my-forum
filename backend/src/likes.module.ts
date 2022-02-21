import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesController } from './controllers/likes.controller';
import { LikeComment, LikeCommentSchema } from './models/likes/likecomment.schema';
import { LikePost, LikePostSchema } from './models/likes/likepost.schema';
import { LikesService } from './services/likes.service';

@Module({
    imports:[MongooseModule.forFeature([
        { name: LikePost.name, schema: LikePostSchema }, 
        { name: LikeComment.name, schema: LikeCommentSchema }]
    )],
    controllers: [LikesController],
    providers: [LikesService]
})

export class LikesModule {}
