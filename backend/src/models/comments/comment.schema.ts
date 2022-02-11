import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../users/user.schema';
import { Post } from '../posts/posts.schema';
import * as mongoose from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
    @Prop()
    text: string;
    @Prop()
    date: Date;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
    post: Post;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    author: User;
    @Prop({required: false})
    lastUpdate: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);