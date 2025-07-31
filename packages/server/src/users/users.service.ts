import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import * as argon2 from 'argon2';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<User>,
  ) {}

  // For administrator
  async create(createUserDto: CreateUserDto, user: User): Promise<User> {
    // check if user already exists
    const newUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (newUser) throw new BadRequestException(`User already exists`);
    const payload = {
      ...createUserDto,
      createdBy: { _id: user._id, email: user.email },
    };
    payload.password = await argon2.hash(createUserDto.password);
    return this.userModel.create(payload);
  }

  // For client
  async register(registerDto: RegisterUserDto): Promise<User> {
    const user = await this.userModel
      .findOne({ email: registerDto.email })
      .exec();
    if (user) throw new BadRequestException(`User already exists`);
    const payload = { ...registerDto, role: 'user' };
    payload.password = await argon2.hash(registerDto.password);
    return this.userModel.create(payload);
  }

  async findAll(query: PaginationDto) {
    const { page: currentPage, limit, ...qs } = query;
    const { filter, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const defaultLimit = limit ?? 10;
    const skip = (currentPage - 1) * defaultLimit;
    const totalItems = await this.userModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(defaultLimit)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        pageSize: defaultLimit,
        currentPage: currentPage,
        totalPages,
        totalItems,
      },
      results,
    };
  }

  async findOne(id: string): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    user: User,
  ): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const payload = {
      ...updateUserDto,
      updatedBy: { _id: user._id, email: user.email },
    };
    const updatedUser = await this.userModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedUser)
      throw new NotFoundException(`User with ID ${id} not found`);
    return updatedUser;
  }

  async remove(id: string, user: User) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { deletedBy: { _id: user._id, email: user.email } },
      {
        new: true,
      },
    );
    if (!updatedUser)
      throw new NotFoundException(`User with ID ${id} not found`);
    await this.userModel.softDelete({ _id: id });
    return { message: 'User deleted successfully' };
  }
}
