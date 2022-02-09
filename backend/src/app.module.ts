import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module';
import { PostsModule } from './posts.module';
import { CommentsModule } from './comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://kemplail:*WJ2sB@cluster0.rfu85.mongodb.net/my-forum?retryWrites=true&w=majority'
    ),
    UserModule,
    PostsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
