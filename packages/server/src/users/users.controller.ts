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
import { ApiTags } from '@nestjs/swagger';
import { IsPublic, UserDecorator } from 'src/auth/decoratots/auth.decorator';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @UserDecorator() user: UserDocument,
  ): Promise<UserDocument> {
    return await this.usersService.create(createUserDto, user);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query);
  }

  // Public for displaying all the clients on homepage
  @IsPublic()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDocument> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserDecorator() user: UserDocument,
  ): Promise<UserDocument> {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @UserDecorator() user: UserDocument) {
    return this.usersService.remove(id, user);
  }
}
