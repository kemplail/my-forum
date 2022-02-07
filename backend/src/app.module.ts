import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://kemplail:*WJ2sB@cluster0.rfu85.mongodb.net/my-forum?retryWrites=true&w=majority', { useNewUrlParser: true }
    )
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
