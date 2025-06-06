import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../models/users/dto/CreateUserDTO';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/users/user.schema';
import { IdParam } from '../models/IdParam';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDTO: CreateUserDto): Promise<User>{
        
        try {
            
            await this.findByUsername(createUserDTO.username); 

        } catch(e) {

            if(e instanceof NotFoundException) {
                
                const saltOrRounds = 10;
                const hash = await bcrypt.hash(createUserDTO.password, saltOrRounds);

                const {password,...userWithoutPass} = createUserDTO;
                const userToCreate = {password: hash, ...userWithoutPass};
                const createdUser = new this.userModel(userToCreate);
                
                return createdUser.save();

            }

        }

        throw new ConflictException();

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
        const userDeleted = await this.userModel.deleteOne({ _id: param.id}).exec();
        return userDeleted;
    }

    async update(param: IdParam, updateUserDto : CreateUserDto) {

        const saltOrRounds = 10;
        const hash = await bcrypt.hash(updateUserDto.password, saltOrRounds);

        return await this.userModel.findOneAndUpdate({ _id: updateUserDto.username, email: updateUserDto.email }, { $set: { username: updateUserDto.username, email: updateUserDto.email, password: hash }}, { new: true });

    }

    async findByUsername(username: string) {
        const user = await this.userModel.findOne({username:username}).exec();

        if(!user) {
            throw new NotFoundException();
        }
        return user;
    }

}