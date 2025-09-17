import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: UserDocument) {
    const isExists = await this.subscriberModel.findOne({
      email: createSubscriberDto.email,
    });
    if (isExists) throw new BadRequestException('Subscriber already exists');
    return this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll({ page: currentPage, limit, ...qs }: PaginationDto) {
    const { filter, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const defaultLimit = limit ?? 10;
    const skip = (currentPage - 1) * defaultLimit;
    const totalItems = await this.subscriberModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.subscriberModel
      .find(filter)
      .skip(skip)
      .limit(defaultLimit)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    return this.subscriberModel.findById(id);
  }

  async update(
    id: string,
    updateSubscriberDto: UpdateSubscriberDto,
    user: UserDocument,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);

    const isExists = await this.subscriberModel.findOne({
      email: updateSubscriberDto.email,
    });
    if (isExists) throw new BadRequestException('Subscriber already exists');

    return this.subscriberModel.updateOne(
      { user: user.email },
      {
        ...updateSubscriberDto,
        updatedBy: { _id: user._id, email: user.email },
      },
      { upsert: true, new: true },
    );
  }

  async remove(id: string, user: UserDocument) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const payload = {
      deletedBy: { _id: user._id, email: user.email },
    };
    // Update deletedBy field
    await this.subscriberModel.findByIdAndUpdate(id, payload);
    await this.subscriberModel.softDelete({ _id: id });
    return { message: 'Subscriber deleted successfully' };
  }
}
