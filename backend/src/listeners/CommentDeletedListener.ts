import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDeletedEvent } from 'src/events/CommentDeletedEvent';
import { LikeComment, LikeCommentDocument } from 'src/models/likes/likecomment.schema';

@Injectable()
export class CommentDeletedListener {

  constructor(@InjectModel(LikeComment.name) private likeCommentModel: Model<LikeCommentDocument>) {}

  @OnEvent('comment.deleted')
  async handleOrderCreatedEvent(event: CommentDeletedEvent) {
    // handle and process "OrderCreatedEvent" event
    await this.likeCommentModel.deleteMany({ 'comment' : {'$in' : event.comments}})
  }
}