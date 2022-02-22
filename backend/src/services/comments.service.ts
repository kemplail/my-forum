import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../models/comments/comment.schema';
import { Model } from 'mongoose';
import { CreateCommentDTO } from 'src/models/comments/dto/CreateCommentDTO';
import { UpdateCommentDTO } from 'src/models/comments/dto/UpdateCommentDTO'
import { IdParam } from 'src/models/IdParam';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

    async create(createCommentDTO : CreateCommentDTO, userid: IdParam): Promise<Comment> {
        const newComment = new this.commentModel({ ...createCommentDTO, author: userid.id });
        newComment.date = new Date();

        return newComment.save();
    }

    async findAll(): Promise<Comment[]> {
        return this.commentModel.find().exec();
    }

    async findOne(param: IdParam) {
        let commentFound = await this.commentModel.findById(param.id).populate('author').populate('post').populate('likes');
        if (!commentFound) {
          return new NotFoundException();
        }
        return commentFound;
    }

    async delete(param: IdParam, userid : IdParam) {
        return this.commentModel.deleteOne({_id: param.id, author: userid.id});
    }

    async update(updateCommentDTO : UpdateCommentDTO, param: IdParam, userId: IdParam) {
        return this.commentModel.updateOne({_id: param.id, author: userId.id},{$set: {...updateCommentDTO, lastUpdate: new Date()}});
    }

    async findAllCommentsOfAPost(param: IdParam) {
        return this.commentModel.find({post:param.id}).populate('author').populate('post').populate('likes');
    }

    async findAllCommentsOfAnUser(param: IdParam) {
        return this.commentModel.find({author:param.id}).populate('author').populate('post').populate('likes');
    }

    async getNbCommentsOfAPost(param: IdParam) {
       return this.commentModel.count({post:param.id});
    }

}
