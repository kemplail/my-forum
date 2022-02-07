import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDTO } from '../dto/CreatePostDTO';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/users/user.schema';
import { IdParam } from '../validation/IdParam';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createPostDTO: CreatePostDTO): Promise<User>{
        const createdUser = new this.userModel(createPostDTO);
        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(param: IdParam) {
        const userFound = await this.userModel.findById(param.id).exec();
        if(!userFound) {
            return new NotFoundException();
        } else {
            return userFound;
        }
    }

    async deleteOne(param: IdParam) {
        let userDeleted = await this.userModel.deleteOne({ _id: param.id}).exec();
        return userDeleted;
    }

}