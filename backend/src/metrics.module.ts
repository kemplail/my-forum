import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsController } from './controllers/metrics.controller';
import { Post, PostSchema } from './models/posts/posts.schema';
import { MetricsService } from './services/metrics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema},
    ]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService]
})
export class MetricsModule {}
