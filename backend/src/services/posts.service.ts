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
    let posts = await this.postModel.find().populate('author').populate('likes');
    return posts;
  }

  async create(createPostDTO: CreatePostDTO, author: IdParam): Promise<Post> {
    
    const newPost = new this.postModel({ ...createPostDTO, author:author.id });
    newPost.date = new Date();
    (await newPost.populate('author')).populate('likes');

    return newPost.save();
  }

  async findOne(param: IdParam) {
    let postFound = await this.postModel.findById(param.id).populate('author').populate('likes');
    if (!postFound) {
      return new NotFoundException();
    } else {
      return postFound;
    }
  }

  async deleteOne(param: IdParam, userid: IdParam) {
    return await this.postModel.findOneAndDelete({ _id: param.id, author: userid.id }).exec();
  }

  async update(updatePostDTO: UpdatePostDTO, param: IdParam, userid: IdParam) {
    return await this.postModel.findOneAndUpdate({ _id: param.id, author: userid.id }, { $set: {...updatePostDTO, lastUpdate: new Date() }}, { new: true });
  }

  async getPostsOfAnUser(param: IdParam) {
    return await this.postModel.find({author:param.id});
  }

}
