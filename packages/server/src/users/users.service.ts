import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash the password before saving
    if (createUserDto.password) {
      createUserDto.password = await argon2.hash(createUserDto.password);
    }
    return this.userModel.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async remove(id: string): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    await this.userModel.softDelete({ _id: id });
    return this.userModel.findById(id).exec() as Promise<User>;
  }
}
