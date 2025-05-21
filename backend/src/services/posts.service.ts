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
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AdvancedSearchDTO } from 'src/models/posts/dto/AdvancedSearchDTO';
import { HybridSearchDTO } from 'src/models/posts/dto/HybridSearchDTO';
import {
  AtomicCondition,
  LogicalCondition,
  LogicalOperator,
} from 'src/parser/types';
import {
  CompoundBasicOperator,
  mongoSearchOperatorMap,
  transformParsedQueryToMongoQuery,
} from 'src/utils/parser.utils';

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
    private httpService: HttpService,
  ) {}

  async advancedSearch(query: LogicalCondition) {
    const mongoQuery = transformParsedQueryToMongoQuery({
      conditions: query.conditions,
      operatorToApply: query.operator,
    });

    return mongoQuery;
  }

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
              order: -1,
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
        $unset: 'vector',
      },
      {
        $addFields: {
          meta: { totalCount: '$$SEARCH_META.count.total' },
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
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $group: {
          _id: null,
          documents: { $push: '$$ROOT' },
          meta: {
            $first: '$meta',
          },
        },
      },
      {
        $unset: 'documents.meta',
      },
      {
        $project: {
          _id: 0,
          'documents.author.password': 0,
        },
      },
    ];

    const [{ documents, meta } = { documents: [], meta: { totalCount: 0 } }] =
      await this.postModel.aggregate<PaginatedPostWithLikes>(aggregationSteps);

    return {
      documents:
        direction && direction === 'before' ? documents.reverse() : documents,
      meta,
    };
  }

  async semanticSearch({ query, page = 1, pageSize = 10 }: AdvancedSearchDTO) {
    const vector = await this.vectorizeSearch(query);
    const limit = 100;
    const numCandidates = limit * 30;

    const aggregationSteps: PipelineStage[] = [
      {
        $vectorSearch: {
          queryVector: vector,
          path: 'vector',
          numCandidates,
          index: 'vector_index',
          limit,
        },
      },
      {
        $addFields: {
          score: { $meta: 'vectorSearchScore' },
        },
      },
      {
        $match: {
          score: { $gte: 0.9 },
        },
      },
      {
        $unset: 'score',
      },
      {
        $facet: {
          documents: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $unset: 'vector',
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
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
              },
            },
            {
              $unwind: '$author',
            },
            {
              $project: {
                'author.password': 0,
              },
            },
          ],
          totalCount: [{ $count: 'totalCount' }],
        },
      },
      {
        $project: {
          documents: 1,
          meta: {
            totalCount: {
              $ifNull: [{ $arrayElemAt: ['$totalCount.totalCount', 0] }, 0],
            },
          },
        },
      },
    ];

    const [{ documents, meta } = { documents: [], meta: { totalCount: 0 } }] =
      await this.postModel.aggregate<PaginatedPostWithLikes>(aggregationSteps);

    return { documents, meta };
  }

  async hybridSearch({
    query,
    page = 1,
    pageSize = 10,
    weights = {
      text: 0.6,
      semantic: 0.4,
    },
  }: HybridSearchDTO) {
    const limit = 100;
    const intermediateLimit = limit * 2;

    const vector = await this.vectorizeSearch(query);
    const numCandidates = intermediateLimit * 30;
    const constant = 60;

    const minScore = 0.0055;

    const firstGroupStep = {
      $group: {
        _id: null,
        docs: { $push: '$$ROOT' },
      },
    };

    const unwindStep = {
      $unwind: {
        path: '$docs',
        includeArrayIndex: 'rank',
      },
    };

    const docsInformationRetrieval = {
      _id: '$docs._id',
      author: '$docs.author',
      text: '$docs.text',
      title: '$docs.title',
      date: '$docs.date',
    };

    const aggregationSteps: PipelineStage[] = [
      {
        $vectorSearch: {
          queryVector: vector,
          path: 'vector',
          numCandidates,
          index: 'vector_index',
          limit: intermediateLimit,
        },
      },
      firstGroupStep,
      unwindStep,
      this.addRRFScoreStep({
        fieldName: 'vs_score',
        weight: weights.semantic,
        constant,
      }),
      {
        $project: {
          ...docsInformationRetrieval,
          vs_score: 1,
        },
      },
      {
        $unionWith: {
          coll: 'posts',
          pipeline: [
            {
              $search: {
                phrase: {
                  query: query,
                  path: ['title', 'text'],
                  slop: 2,
                },
              },
            },
            {
              $limit: intermediateLimit,
            },
            firstGroupStep,
            unwindStep,
            this.addRRFScoreStep({
              fieldName: 'ts_score',
              weight: weights.text,
              constant: 60,
            }),
            {
              $project: {
                ...docsInformationRetrieval,
                ts_score: 1,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          author: { $first: '$author' },
          text: { $first: '$text' },
          date: { $first: '$date' },
          vs_score: { $max: '$vs_score' },
          ts_score: { $max: '$ts_score' },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          author: 1,
          text: 1,
          date: 1,
          score: {
            $add: [
              { $ifNull: ['$vs_score', 0] },
              { $ifNull: ['$ts_score', 0] },
            ],
          },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
      {
        $match: {
          score: { $gte: minScore },
        },
      },
      { $unset: ['score', 'vector'] },
      {
        $limit: limit,
      },
      {
        $facet: {
          documents: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: 'likeposts',
                localField: '_id',
                foreignField: 'post',
                as: 'likes',
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
              },
            },
            {
              $unwind: '$author',
            },
            {
              $project: {
                'author.password': 0,
              },
            },
          ],
          totalCount: [
            {
              $count: 'totalCount',
            },
          ],
        },
      },
      {
        $project: {
          documents: 1,
          meta: {
            totalCount: {
              $ifNull: [{ $arrayElemAt: ['$totalCount.totalCount', 0] }, 0],
            },
          },
        },
      },
    ];

    const [{ documents, meta } = { documents: [], meta: { totalCount: 0 } }] =
      await this.postModel.aggregate<PaginatedPostWithLikes>(aggregationSteps);

    return { documents, meta };
  }

  addRRFScoreStep({
    fieldName,
    weight,
    constant,
  }: {
    fieldName: 'vs_score' | 'ts_score';
    weight: number;
    constant: number;
  }) {
    return {
      $addFields: {
        [fieldName]: {
          $multiply: [
            weight,
            {
              $divide: [
                1.0,
                {
                  $add: ['$rank', constant],
                },
              ],
            },
          ],
        },
      },
    };
  }

  async vectorizeSearch(text: string): Promise<number[]> {
    let vector: number[];

    try {
      const response = await lastValueFrom(
        this.httpService.post<{ vector: number[] }>(
          `${process.env.SEMANTIC_SEARCH_API_URL}/vectorize-search`,
          {
            text,
          },
        ),
      );

      vector = response.data.vector;
    } catch (e) {
      throw new Error(
        `An error occured when trying to call semantic search api : ${e}`,
      );
    }

    if (!vector) {
      throw new Error('Vector not defined');
    }

    return vector;
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
