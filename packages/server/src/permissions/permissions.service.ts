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
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { Permission, PermissionDocument } from './permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: UserDocument) {
    // Need to check if permission method + permission apiPath is unique
    const isExist = await this.permissionModel.findOne({
      method: createPermissionDto.method,
      apiPath: createPermissionDto.apiPath,
    });
    if (isExist)
      throw new BadRequestException(
        `Permission with method ${createPermissionDto.method} and apiPath ${createPermissionDto.apiPath} already exists`,
      );
    return this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll({ page: currentPage, limit, ...qs }: PaginationDto) {
    const { filter, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const defaultLimit = limit ?? 10;
    const skip = (currentPage - 1) * defaultLimit;
    const totalItems = await this.permissionModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.permissionModel
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Invalid ID ${id}`);
    const permission = await this.permissionModel.findById(id).exec();
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: UserDocument,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);

    // Check for duplicate apiPath and method exept for current permission
    const permission = await this.permissionModel.findOne({
      method: updatePermissionDto.method,
      apiPath: updatePermissionDto.apiPath,
    });
    if (permission && permission._id.toString() !== id)
      throw new BadRequestException(
        `Permission with method ${updatePermissionDto.method} and apiPath ${updatePermissionDto.apiPath} already exists`,
      );
    return this.permissionModel
      .findByIdAndUpdate(
        id,
        {
          ...updatePermissionDto,
          updatedBy: { _id: user._id, email: user.email },
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string, user: UserDocument) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Invalid ID ${id}`);
    const payload = {
      deletedBy: { _id: user._id, email: user.email },
    };
    // Update deletedBy field
    await this.permissionModel.findByIdAndUpdate(id, payload);
    await this.permissionModel.softDelete({ _id: id });
    return { message: 'Permission deleted successfully' };
  }
}
