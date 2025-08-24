import { ResumeStatus } from '@base/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserDecorator } from 'src/auth/decoratots/auth.decorator';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { ResponseMessage } from 'src/core/interceptors/transformData.interceptor';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateResumeDto } from './dtos/create-resume.dto';
import { ResumesService } from './resumes.service';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  async create(
    @Body() createUserCvDto: CreateResumeDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Get()
  @ResponseMessage('Get all resumes')
  findAll(@Query() query: PaginationDto) {
    return this.resumesService.findAll(query);
  }

  @Get('by-user')
  @ResponseMessage('Get all CVs by user')
  findByUser(@UserDecorator() user: UserDocument) {
    return this.resumesService.findByUser(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a resume')
  update(
    @Param('id') id: string,
    @Body('status') status: ResumeStatus,
    @UserDecorator() user: UserDocument,
  ) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a resume')
  delete(@Param('id') id: string, @UserDecorator() user: UserDocument) {
    return this.resumesService.delete(id, user);
  }
}
