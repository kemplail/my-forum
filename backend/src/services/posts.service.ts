import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDTO } from '../models/posts/dto/CreatePostDTO';
import { UpdatePostDTO } from '../models/posts/dto/UpdatePostDTO';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../models/posts/posts.schema';
import { IdParam } from '../models/IdParam';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostDeletedEvent } from 'src/events/PostDeletedEvent';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll({
    page = 0,
    pageSize = 10,
  }: {
    page?: number;
    pageSize?: number;
  }) {
    let posts = await this.postModel
      .find()
      .populate('likes')
      .skip(page * pageSize)
      .limit(pageSize);

    return posts;
  }

  async create(createPostDTO: CreatePostDTO, author: IdParam): Promise<Post> {
    const newPost = new this.postModel({ ...createPostDTO, author: author.id });
    newPost.date = new Date();
    (await newPost.populate('author')).populate('likes');

    return newPost.save();
  }

  async findOne(param: IdParam) {
    let postFound = await this.postModel.findById(param.id).populate('likes');
    if (!postFound) {
      return new NotFoundException();
    } else {
      return postFound;
    }
  }

  async deleteOne(param: IdParam, userid: IdParam) {
    const deletedPost = await this.postModel
      .findOneAndDelete({ _id: param.id, author: userid.id })
      .exec();

    const postDeletedEvent = new PostDeletedEvent();
    postDeletedEvent._id = deletedPost._id.toString();
    this.eventEmitter.emit('post.deleted', postDeletedEvent);

    return deletedPost;
  }

  async update(updatePostDTO: UpdatePostDTO, param: IdParam, userid: IdParam) {
    return await this.postModel.findOneAndUpdate(
      { _id: param.id, author: userid.id },
      { $set: { ...updatePostDTO, lastUpdate: new Date() } },
      { new: true },
    );
  }

  async getPostsOfAnUser(param: IdParam) {
    return await this.postModel.find({ author: param.id });
  }
}
