import {
  Schema,
  Prop,
  SchemaFactory,
  InjectModel,
  getModelToken,
} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';
import * as mongoose from 'mongoose';

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
