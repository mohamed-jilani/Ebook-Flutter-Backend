import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(name: string, email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = new this.userModel({ name, email, password: hashedPassword });
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, updateData: Partial<User>): Promise<User | null> {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async remove(id: string): Promise<{ deleted: boolean }> {
        const res = await this.userModel.deleteOne({ _id: id }).exec();
        return { deleted: res.deletedCount > 0 };
    }

}
