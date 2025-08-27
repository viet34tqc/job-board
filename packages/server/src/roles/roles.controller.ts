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
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateRoleDto } from './dtds/create-role.dto';
import { UpdateRoleDto } from './dtds/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @UserDecorator() user: UserDocument,
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @UserDecorator() user: UserDocument) {
    return this.rolesService.remove(id, user);
  }

  @Post(':id/permissions')
  async updatePermissions(
    @Param('id') id: string,
    @Body() { permissionIds }: { permissionIds: string[] },
  ) {
    return this.rolesService.updateRolePermissions(id, permissionIds);
  }
}
