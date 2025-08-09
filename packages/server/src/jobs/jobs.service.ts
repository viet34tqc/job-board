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
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { Job, JobDocument } from './jobs.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  validateDateRange(startDate?: Date, endDate?: Date) {
    if (!startDate || !endDate) return;
    console.log('startDate > endDate', startDate > endDate);
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
  }

  create(createJobDto: CreateJobDto, user: UserDocument) {
    this.validateDateRange(createJobDto.startDate, createJobDto.endDate);
    const payload = {
      ...createJobDto,
      skills: createJobDto.skills,
      createdBy: { _id: user._id, email: user.email },
    };
    return this.jobModel.create(payload);
  }

  async findAll({ page: currentPage, limit, ...qs }: PaginationDto) {
    const { filter, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const defaultLimit = limit ?? 10;
    const skip = (currentPage - 1) * defaultLimit;
    const totalItems = await this.jobModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.jobModel
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

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    return this.jobModel.findById(id).exec();
  }

  update(id: string, updateJobDto: UpdateJobDto, user: UserDocument) {
    console.log('updateJobDto', updateJobDto);
    console.log('id', id);
    this.validateDateRange(updateJobDto.startDate, updateJobDto.endDate);
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const payload = {
      ...updateJobDto,
      updatedBy: { _id: user._id, email: user.email },
    };
    return this.jobModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async remove(id: string, user: UserDocument) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const payload = {
      deletedBy: { _id: user._id, email: user.email },
    };
    // Update deletedBy field
    await this.jobModel.findByIdAndUpdate(id, payload);
    await this.jobModel.softDelete({ _id: id });
    return { message: 'Job deleted successfully' };
  }
}
