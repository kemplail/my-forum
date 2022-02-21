import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../users/user.schema';
import * as mongoose from 'mongoose';
import { Post } from '../posts/posts.schema';

export type LikePostDocument = LikePost & Document;

@Schema()
export class LikePost {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
    post: Post;
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);