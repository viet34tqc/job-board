import { Body, Controller, Post } from '@nestjs/common';
import { UserDecorator } from 'src/auth/decoratots/auth.decorator';
import { ResponseMessage } from 'src/core/interceptors/transformData.interceptor';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateResumeDto } from './dtos/create-resume.dto';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  async create(
    @Body() createUserCvDto: CreateResumeDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this.resumeService.create(createUserCvDto, user);
  }
}
