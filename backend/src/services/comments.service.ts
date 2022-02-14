import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../models/comments/comment.schema';
import { Model } from 'mongoose';
import { CreateCommentDTO } from 'src/dto/CreateCommentDTO';
import { UpdateCommentDTO } from 'src/dto/UpdateCommentDTO';
import { IdParam } from 'src/dto/IdParam';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

    async create(createCommentDTO : CreateCommentDTO): Promise<Comment> {
        const newComment = new this.commentModel(createCommentDTO);
        newComment.date = new Date();
        (await newComment.populate("author")).populate("post");

        return newComment.save();
    }

    async findAll(): Promise<Comment[]> {
        return this.commentModel.find().exec();
    }

    async findOne(param: IdParam) {
        let commentFound = await this.commentModel.findById(param.id).populate('author').populate('post');
        if (!commentFound) {
          return new NotFoundException();
        }
        return commentFound;
    }

    async delete(param: IdParam) {
        return this.commentModel.deleteOne({_id: param.id});
    }

    async update(updateCommentDTO : UpdateCommentDTO, param: IdParam) {
        return this.commentModel.updateOne({_id: param.id},{$set: {...updateCommentDTO, lastUpdate: new Date()}});
    }

    async findAllCommentsOfAPost(param: IdParam) {
        return this.commentModel.find({post:param.id}).populate('author').populate('post');
    }

    async findAllCommentsOfAnUser(param: IdParam) {
        return this.commentModel.find({author:param.id}).populate('author').populate('post');
    }

    async getNbCommentsOfAPost(param: IdParam) {
       return this.commentModel.count({post:param.id});
    }

}
