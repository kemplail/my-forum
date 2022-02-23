import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../users/user.schema';
import * as mongoose from 'mongoose';
import { Comment } from '../comments/comment.schema';

export type LikeCommentDocument = LikeComment & Document;

@Schema()
export class LikeComment {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Comment'})
    comment: Comment;
    @Prop()
    date: Date;
}

export const LikeCommentSchema = SchemaFactory.createForClass(LikeComment);