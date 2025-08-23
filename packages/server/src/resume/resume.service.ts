import { RESUME_STATUS } from '@base/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateCvDto } from './dtos/create-cv.dto';
import { Resume, ResumeDocument } from './resume.schema';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(createCvDto: CreateCvDto, user: UserDocument) {
    const newCv = await this.resumeModel.create({
      ...createCvDto,
      email: user.email,
      userId: user._id,
      status: RESUME_STATUS.PENDING,
      createdBy: user,
      history: [
        {
          status: RESUME_STATUS.PENDING,
          updatedBy: user,
          updatedAt: new Date(),
        },
      ],
    });

    return newCv;
  }
}
