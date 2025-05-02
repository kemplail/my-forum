import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';
import * as mongoose from 'mongoose';
import { LikePost } from '../likes/likepost.schema';

export type PostDocument = Post & Document<Types.ObjectId>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Post {
  @Prop()
  title: string;
  @Prop()
  date: Date;
  @Prop()
  text: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
  @Prop({ required: false })
  lastUpdate: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('likes', {
  ref: 'LikePost',
  localField: '_id',
  foreignField: 'post',
});

export type Pagination = { totalCount: number };
export type PostWithLikes = Post & { likes: LikePost[] };
export type PaginatedPostWithLikes = {
  documents: PostWithLikes[];
  meta: Pagination;
};
