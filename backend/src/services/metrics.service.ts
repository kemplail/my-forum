import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Date, Model } from 'mongoose';
import { lastValueFrom, Observable } from 'rxjs';
import { Comment, CommentDocument } from 'src/models/comments/comment.schema';
import { IdParam } from 'src/models/IdParam';
import { LikePost, LikePostDocument } from 'src/models/likes/likepost.schema';
import { GetDatedDataDTO } from 'src/models/metrics/dto/GetDatedDataDTO';
import { Post, PostDocument } from 'src/models/posts/posts.schema';

const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class MetricsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(LikePost.name) private likePostModel: Model<LikePostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private httpService: HttpService,
  ) {}

  async getNbPostsUser(userid: IdParam, dateParam: GetDatedDataDTO) {
    return await this.postModel.countDocuments({
      author: userid.id,
      date: { $gte: new Date(dateParam.date).toISOString() },
    });
  }

  async getNbLikesReceivedOnPostUser(
    userid: IdParam,
    dateParam: GetDatedDataDTO,
  ) {
    const result = await this.postModel.aggregate([
      { $match: { author: new ObjectId(userid.id) } },
      {
        $lookup: {
          from: 'likeposts',
          localField: '_id',
          foreignField: 'post',
          as: 'likeposts',
        },
      },
      { $unwind: '$likeposts' },
      { $match: { 'likeposts.date': { $gte: new Date(dateParam.date) } } },
      { $count: 'likes' },
    ]);

    if (result.length == 0) {
      return 0;
    }

    return result[0].likes;
  }

  async getNbCommentsReceivedUser(userid: IdParam, dateParam: GetDatedDataDTO) {
    const result = await this.postModel.aggregate([
      { $match: { author: new ObjectId(userid.id) } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      { $unwind: '$comments' },
      { $match: { 'comments.date': { $gte: new Date(dateParam.date) } } },
      { $count: 'comments' },
    ]);

    if (result.length == 0) {
      return 0;
    }

    return result[0].comments;
  }

  async getNbCommentsPostedUser(userid: IdParam, dateParam: GetDatedDataDTO) {
    return await this.commentModel.countDocuments({
      author: userid.id,
      date: { $gte: new Date(dateParam.date).toISOString() },
    });
  }

  async getNbPostsPerUser() {
    const result = await this.postModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $group: {
          _id: '$author',
          name: { $first: '$user.username' },
          count: {
            $count: {},
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          count: 1,
        },
      },
    ]);

    return result;
  }

  async getEvolutionNbPosts(userid: IdParam, dateParam: GetDatedDataDTO) {
    const result = await this.postModel.aggregate([
      {
        $match: {
          author: new ObjectId(userid.id),
          date: { $gte: new Date(dateParam.date) },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
            year: { $year: '$date' },
          },
          count: {
            $count: {},
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    return result;
  }

  async getEvolutionLikesReceivedOnPostUser(
    userid: IdParam,
    dateParam: GetDatedDataDTO,
  ) {
    const result = await this.postModel.aggregate([
      { $match: { author: new ObjectId(userid.id) } },
      {
        $lookup: {
          from: 'likeposts',
          localField: '_id',
          foreignField: 'post',
          as: 'likeposts',
        },
      },
      { $unwind: '$likeposts' },
      { $match: { 'likeposts.date': { $gte: new Date(dateParam.date) } } },
      {
        $group: {
          _id: {
            month: { $month: '$likeposts.date' },
            day: { $dayOfMonth: '$likeposts.date' },
            year: { $year: '$likeposts.date' },
          },
          count: {
            $count: {},
          },
        },
      },
    ]);

    return result;
  }

  async getWordsUsedInPosts(): Promise<Record<string, number>> {
    let response = await lastValueFrom(
      this.httpService.get(
        'https://flask-api-my-forum-umqnlitcoa-ew.a.run.app/posts',
      ),
    );
    return response.data;
  }
}
