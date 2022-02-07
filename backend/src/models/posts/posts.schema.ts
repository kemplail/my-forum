import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post {
    @Prop()
    _id: number;
    @Prop()
    title: string;
    @Prop()
    text: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);