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
import { IsPublic, UserDecorator } from 'src/auth/decoratots/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @UserDecorator() user: User,
  ): Promise<User> {
    return await this.usersService.create(createUserDto, user);
  }

  @Get()
  findAll(
    @Query('page') currentPage: number,
    @Query('limit') limit: number,
    @Query() qs: string,
  ) {
    return this.usersService.findAll({ currentPage, limit, qs });
  }

  // Public for displaying all the clients on homepage
  @IsPublic()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserDecorator() user: User,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @UserDecorator() user: User) {
    return this.usersService.remove(id, user);
  }
}
