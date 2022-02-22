import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDeletedEvent } from 'src/events/PostDeletedEvent';
import { Comment, CommentDocument } from 'src/models/comments/comment.schema';
import { LikePost, LikePostDocument } from 'src/models/likes/likepost.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentDeletedEvent } from 'src/events/CommentDeletedEvent';

@Injectable()
export class PostDeletedListener {

  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>, 
  @InjectModel(LikePost.name) private likePostModel: Model<LikePostDocument>,
  private eventEmitter: EventEmitter2) {}

  @OnEvent('post.deleted')
  async handleOrderCreatedEvent(event: PostDeletedEvent) {

    // handle and process "OrderCreatedEvent" event
    const comments = await (await this.commentModel.find({post: event._id}, 'id'))
    const mappedcomments = comments.map((element) => element._id.toString());

    await this.commentModel.deleteMany({ '_id' : {'$in' : mappedcomments}});

    const commentDeletedEvent = new CommentDeletedEvent();
    commentDeletedEvent.comments = mappedcomments;

    this.eventEmitter.emit('comment.deleted', commentDeletedEvent);

    await this.likePostModel.deleteMany({post: event._id});
  }
}