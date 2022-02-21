import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, UserSchema } from '../users/user.schema';
import * as mongoose from 'mongoose';

export type PostDocument = Post & Document;

@Schema({
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
})
export class Post {
    @Prop()
    title: string;
    @Prop()
    date: Date;
    @Prop()
    text: string;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    author: User;
    @Prop({required: false})
    lastUpdate: Date;

}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('likes', {
    ref:'LikePost',
    localField:'_id',
    foreignField:'post'
})

/*
PostSchema.pre<Post>( "deleteOne", function (next) { 
    console.log("lol");
    next(); 
} );
*/