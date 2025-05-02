import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDTO } from '../models/posts/dto/CreatePostDTO';
import { UpdatePostDTO } from '../models/posts/dto/UpdatePostDTO';
import { Model, PipelineStage } from 'mongoose';
import {
  PaginatedPostWithLikes,
  Post,
  PostDocument,
} from '../models/posts/posts.schema';
import { IdParam } from '../models/IdParam';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostDeletedEvent } from 'src/events/PostDeletedEvent';

const DEFAULT_PAGE_SIZE = 10;

export type FindAllPostsParams =
  | {
      query: string;
      pageSize?: number;
      direction: 'before' | 'after';
      paginationToken: string;
    }
  | {
      query: string;
      pageSize?: number;
      direction?: never;
      paginationToken?: never;
    };

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll({
    query,
    pageSize = DEFAULT_PAGE_SIZE,
    direction,
    paginationToken,
  }: FindAllPostsParams) {
    const searchOperator = query
      ? {
          phrase: {
            query,
            path: ['title', 'text'],
            slop: 2,
          },
        }
      : { exists: { path: 'title' } };

    let paginationOption:
      | { searchBefore: string }
      | { searchAfter: string }
      | {} = {};

    if (paginationToken) {
      if (direction === 'before') {
        paginationOption = { searchBefore: paginationToken };
      } else {
        paginationOption = { searchAfter: paginationToken };
      }
    }

    const aggregationSteps: PipelineStage[] = [
      {
        $search: {
          ...searchOperator,
          sort: {
            score: {
              $meta: 'searchScore',
              order: 1,
            },
            _id: 1,
          },
          ...paginationOption,
          count: {
            type: 'total',
          },
        },
      },
      {
        $limit: pageSize,
      },
      {
        $addFields: {
          totalCount: '$$SEARCH_META.count.total',
          paginationToken: { $meta: 'searchSequenceToken' },
        },
      },
      {
        $lookup: {
          from: 'likeposts',
          localField: '_id',
          foreignField: 'post',
          as: 'likes',
        },
      },
      {
        $group: {
          _id: null,
          documents: { $push: '$$ROOT' },
        },
      },
      {
        $addFields: {
          meta: {
            totalCount: {
              $getField: {
                field: 'totalCount',
                input: {
                  $arrayElemAt: ['$documents', 0],
                },
              },
            },
          },
        },
      },
      {
        $unset: 'documents.totalCount',
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];

    const result =
      await this.postModel.aggregate<PaginatedPostWithLikes>(aggregationSteps);

    const { documents = [], meta = { totalCount: 0 } } = result[0] || {};

    return {
      documents:
        direction && direction === 'before' ? documents.reverse() : documents,
      meta,
    };
  }

  async create(createPostDTO: CreatePostDTO, author: IdParam) {
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
