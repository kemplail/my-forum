import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Comment {
    @Prop()
    _id: number;
    @Prop()
    text: string;
    @Prop()
    date: date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);