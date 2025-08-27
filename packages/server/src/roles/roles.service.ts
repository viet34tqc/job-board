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
import { CreateRoleDto } from './dtds/create-role.dto';
import { UpdateRoleDto } from './dtds/update-role.dto';
import { Role, RoleDocument } from './role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: UserDocument) {
    return this.roleModel.create({
      ...createRoleDto,
      createdBy: { _id: user._id, email: user.email },
    });
  }

  async findAll({ page: currentPage, limit, ...qs }: PaginationDto) {
    const { filter, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const defaultLimit = limit ?? 10;
    const skip = (currentPage - 1) * defaultLimit;
    const totalItems = await this.roleModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.roleModel
      .find(filter)
      .skip(skip)
      .limit(defaultLimit)
      .populate(population || 'permissions')
      .exec();

    return {
      meta: {
        pageSize: defaultLimit,
        currentPage,
        totalPages,
        totalItems,
      },
      results,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Invalid ID ${id}`);
    const role = await this.roleModel
      .findById(id)
      // Join the table permissions
      .populate({
        path: 'permissions',
        select: { _id: 1, apiPath: 1, method: 1, name: 1 },
      })
      .exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: UserDocument) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Invalid ID ${id}`);
    const isExist = await this.roleModel.findOne({ name: updateRoleDto.name });
    if (isExist && isExist._id.toString() !== id)
      throw new BadRequestException(
        `Role with name ${updateRoleDto.name} already exists`,
      );
    return this.roleModel
      .findByIdAndUpdate(
        id,
        { ...updateRoleDto, updatedBy: { _id: user._id, email: user.email } },
        { new: true },
      )
      .populate('permissions')
      .exec();
  }

  async remove(id: string, user: UserDocument) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Invalid ID ${id}`);
    const payload = { deletedBy: { _id: user._id, email: user.email } };
    await this.roleModel.findByIdAndUpdate(id, payload);
    await this.roleModel.softDelete({ _id: id });
    return { message: 'Role deleted successfully' };
  }

  async updateRolePermissions(id: string, permissionIds: string[]) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Invalid ID ${id}`);
    const updatedRole = await this.roleModel
      .findByIdAndUpdate(id, { permissions: permissionIds }, { new: true })
      .populate('permissions')
      .exec();
    if (!updatedRole) throw new NotFoundException('Role not found');
    return updatedRole;
  }
}
