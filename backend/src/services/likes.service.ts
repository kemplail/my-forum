import { ConflictException, Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLikeCommentDTO } from 'src/models/likes/dto/CreateLikeCommentDTO';
import { CreateLikePostDTO } from 'src/models/likes/dto/CreateLikePostDTO';
import { IdParam } from 'src/models/IdParam';
import { LikeComment } from 'src/models/likes/likecomment.schema';
import { LikePost } from 'src/models/likes/likepost.schema';

@Injectable()
export class LikesService {

    constructor(@InjectModel(LikePost.name) private likePostModel : Model<LikePost>, 
    @InjectModel(LikeComment.name) private likeCommentModel : Model<LikeComment>) {}

    async findAllLikesOfAPost(@Param() param: IdParam ) {
        return await this.likePostModel.find({ post: param.id });
    }

    async findAllLikesOfAComment(param: IdParam) {
        return await this.likeCommentModel.find({ comment: param.id });
    }

    async findLikeOfLoggedUserOfAPost(param: IdParam, userid : IdParam) {
        return await this.likePostModel.findOne({ post: param.id, user: userid.id })
    }

    async findLikeOfLoggedUserOfComment(param: IdParam, userid : IdParam) {
        return await this.likeCommentModel.findOne({ comment: param.id, user: userid.id })
    }

    async addLikeToAPost(createLikePostDTO : CreateLikePostDTO, userid : IdParam) {

        const searchedLike = await this.likePostModel.findOne({ user: userid.id, post: createLikePostDTO.post })

        if(!searchedLike) {

            const newLikePost = new this.likePostModel({ ...createLikePostDTO, user: userid.id });
            (await newLikePost.populate('post')).populate('user');
    
            return newLikePost.save();

        }

        throw new ConflictException();

    }

    async addLikeToAComment(createLikeCommentDTO : CreateLikeCommentDTO, userid: IdParam) {

        const searchedLike = await this.likeCommentModel.findOne({ user: userid.id, comment: createLikeCommentDTO.comment })

        if(!searchedLike) {

            const newLikeComment = new this.likeCommentModel({ ...createLikeCommentDTO, user: userid.id });
            (await newLikeComment.populate('comment')).populate('user');
     
            return newLikeComment.save();

        }

        throw new ConflictException();

    }

    async deleteLikeOfAPost(param: IdParam, userid: IdParam) {
        
        return this.likePostModel.findOneAndDelete({ post: param.id, user: userid.id });

    }

    async deleteLikeOfAComment(param: IdParam, userid: IdParam) {
        
        return this.likeCommentModel.findOneAndDelete({ comment: param.id, user: userid.id });

    }

}
