import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDTO } from '../dto/CreatePostDTO';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/users/user.schema';

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

    async findOne(id: string) {
        const userFound = await this.userModel.findById(id).exec();
        if(!userFound) {
            return new NotFoundException();
        } else {
            return userFound;
        }
    }

}