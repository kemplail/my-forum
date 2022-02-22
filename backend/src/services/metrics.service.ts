import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdParam } from 'src/models/IdParam';
import { LikePost, LikePostDocument } from 'src/models/likes/likepost.schema';
import { Post, PostDocument } from 'src/models/posts/posts.schema';

@Injectable()
export class MetricsService {

constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, @InjectModel(LikePost.name) private likePostModel : Model<LikePostDocument>) {}

    async getNbPostsUser(userid : IdParam) {
        return await this.postModel.count({author: userid.id});
    }

    async getNbLikesUser(userid : IdParam) {

        const ObjectId = require('mongoose').Types.ObjectId

        const result = await this.postModel.aggregate([
            { $match: { author : ObjectId(userid.id) }},
            { $lookup: {
                from: "likeposts", // collection name in db
                localField: "_id",
                foreignField: "post",
                as: "likeposts"
            }},
            { $unwind: "$likeposts" },
            { $count: "likes" }
        ]);

        return result;
    }

    async getNbPostsUserSinceSevenDays(userid : IdParam) {

        const date = new Date();
        date.setDate(date.getDate() - 7);

        return await this.postModel.count({
            author: userid.id,
            date: { $gte : date.toISOString() }
        })

    }

}