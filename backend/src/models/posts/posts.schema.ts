import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../users/user.schema';
import * as mongoose from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
    @Prop()
    title: string;
    @Prop()
    date: Date;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Author'})
    author: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);