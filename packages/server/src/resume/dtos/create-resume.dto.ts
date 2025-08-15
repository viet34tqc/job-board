import { RESUME_STATUS, ResumeStatus } from '@base/shared';
import {
  IsEmail,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsMongoId()
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsIn(Object.values(RESUME_STATUS))
  status: ResumeStatus;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsMongoId()
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  jobId: mongoose.Schema.Types.ObjectId;
}
