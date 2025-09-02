import { RESUME_STATUS, ResumeStatus } from '@base/shared';
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
import { CreateResumeDto } from './dtos/create-resume.dto';
import { Resume, ResumeDocument } from './resume.schema';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(createCvDto: CreateResumeDto, user: UserDocument) {
    const newCv = await this.resumeModel.create({
      ...createCvDto,
      email: user.email,
      userId: user._id,
      status: RESUME_STATUS.PENDING,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
      history: [
        {
          status: RESUME_STATUS.PENDING,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
          updatedAt: new Date(),
        },
      ],
    });

    return {
      _id: newCv._id,
      createdAt: newCv.createdAt,
    };
  }

  async findAll({ page: currentPage, limit, ...qs }: PaginationDto) {
    // aqp needs populate and returns population
    // Example: ?page=1&limit=10&populate=companyId,jobId&fields=companyId._id,companyId.name,jobId._id,jobId.name
    const { filter, population, projection } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const defaultLimit = limit ?? 10;
    const skip = (currentPage - 1) * defaultLimit;
    const totalItems = await this.resumeModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.resumeModel
      .find(filter)
      .skip(skip)
      .limit(defaultLimit)
      // Populate is used to join table
      // population: [{ path: "companyId" }, { path: "jobId" }]
      .populate(population)
      // projection is used to select fields
      .select(projection)
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
      throw new BadRequestException(`Invalid ID ${id}`);
    const resume = await this.resumeModel.findById(id).exec();
    if (!resume) throw new NotFoundException('Resume not found');
    return resume;
  }

  async findByUser(user: UserDocument) {
    return this.resumeModel
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'companyId', select: { name: 1 } },
        { path: 'jobId', select: { name: 1 } },
      ])
      .exec();
  }

  async update(id: string, status: ResumeStatus, user: UserDocument) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Invalid ID ${id}`);
    return this.resumeModel
      .findByIdAndUpdate(
        id,
        {
          status,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
          // Push new history
          $push: {
            history: {
              status,
              updatedBy: {
                _id: user._id,
                email: user.email,
              },
              updatedAt: new Date(),
            },
          },
        },
        { new: true },
      )
      .exec();
  }

  async delete(id: string, user: UserDocument) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Invalid ID ${id}`);
    await this.resumeModel.findByIdAndUpdate(id, {
      deletedBy: {
        _id: user._id,
        email: user.email,
      },
    });
    await this.resumeModel.softDelete({ _id: id });
    return { message: 'Resume deleted successfully' };
  }
}
