import { PickType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';

export class CreateCvDto extends PickType(CreateResumeDto, [
  'url',
  'companyId',
  'jobId',
]) {}
