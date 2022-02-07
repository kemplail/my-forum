import { Schema, Prop, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { User } from '../users/user.schema';
import { Post } from '../posts/posts.schema';
import * as mongoose from 'mongoose';

@Schema()
export class Comment {
    @Prop()
    _id: number;
    @Prop()
    text: string;
    @Prop()
    date: Date;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
    post: Post;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    author: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);