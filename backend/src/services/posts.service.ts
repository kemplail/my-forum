import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDTO } from '../dto/CreatePostDTO';
import { UpdatePostDTO } from '../dto/UpdatePostDTO';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../models/posts/posts.schema';
import { IdParam } from '../dto/IdParam';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAll() {
    let posts = await this.postModel.find().populate('author');
    return posts;
  }

  async create(createPostDTO: CreatePostDTO): Promise<Post> {
    const newPost = new this.postModel(createPostDTO);
    newPost.date = new Date();

    return newPost.save();
  }

  async findOne(param: IdParam) {
    let postFound = await this.postModel.findById(param.id).populate('author');
    if (!postFound) {
      return new NotFoundException();
    } else {
      return postFound;
    }
  }

  deleteOne(param: IdParam) {
    return this.postModel.deleteOne({ _id: param.id }).exec();
  }

  async update(updatePostDTO: UpdatePostDTO, param: IdParam) {
    return this.postModel.updateOne({ _id: param.id }, { $set: {...updatePostDTO, lastUpdate: new Date() }});
  }

  async getPostsOfAnUser(param: IdParam) {
    return this.postModel.find({author:param.id});
  }

}
