import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
    @Prop()
    _id: number;
    @Prop()
    username: string;
    @Prop()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);