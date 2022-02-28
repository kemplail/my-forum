import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PostSchema, Post } from './models/posts/posts.schema';
import { CommentSchema, Comment } from './models/comments/comment.schema';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './services/comments.service';
import { LikePost, LikePostSchema } from './models/likes/likepost.schema';
import { LikeComment, LikeCommentSchema } from './models/likes/likecomment.schema';
import { LikesController } from './controllers/likes.controller';
import { LikesService } from './services/likes.service';
import { PostsService } from './services/posts.service';
import { PostDeletedListener } from './listeners/PostDeletedListener';
import { PostsController } from './controllers/posts.controller';
import { User, UserSchema } from './models/users/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { CommentDeletedListener } from './listeners/CommentDeletedListener';
import { ConfigModule } from '@nestjs/config';
import { MetricsController } from './controllers/metrics.controller';
import { MetricsService } from './services/metrics.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DATABASE_LINK
    ),
    EventEmitterModule.forRoot(),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema},
      { name: Comment.name, schema: CommentSchema },
      { name: LikePost.name, schema: LikePostSchema }, 
      { name: LikeComment.name, schema: LikeCommentSchema },
      { name: User.name, schema: UserSchema }
    ]),
    PassportModule, 
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100000s' },
    }),
  ],
  controllers: [AppController, CommentsController, LikesController, PostsController, UserController, MetricsController],
  providers: [CommentsService, LikesService, PostsService, PostDeletedListener, CommentDeletedListener, AuthService, LocalStrategy, JwtStrategy, UserService, MetricsService],
  exports: [AuthService, UserService]
})
export class AppModule {}
