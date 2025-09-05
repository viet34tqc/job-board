import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/permission.schema';
import { CreateRoleDto } from 'src/roles/dtos/create-role.dto';
import { Role, RoleDocument } from 'src/roles/role.schema';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { mockPermissions } from './mockPermission';

@Injectable()
export class MockService {
  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async generateMockData() {
    try {
      await this.clearExistingData();

      // 1. Create roles
      const roles = await this.createRoles();

      const adminRole = roles.find((r) => r.name === 'admin');
      if (!adminRole) throw new Error('Admin role not found after creation');

      // 2. Create users with roles
      const users = await this.createUsers(roles);

      // Find admin user (by known email)
      const adminUser = users.find((u) => u.email === 'admin@example.com');
      if (!adminUser) throw new Error('Admin user not found after creation');

      // 3. Create permissions with admin as creator
      const permissions = await this.createPermissions(adminUser);

      // 4. Update admin role with permissions
      await this.updateAdminRole(adminRole._id.toString(), permissions);

      return { success: true, message: 'Mock data generated successfully' };
    } catch (error) {
      console.error('Error generating mock data:', error);
      throw new Error('Failed to generate mock data');
    }
  }

  private async clearExistingData() {
    await this.userModel.deleteMany({});
    await this.roleModel.deleteMany({});
    await this.permissionModel.deleteMany({});
  }

  private async createRoles(): Promise<RoleDocument[]> {
    const roleDtos: CreateRoleDto[] = [
      {
        name: 'admin',
        description: 'Has full access to all features',
        isActive: true,
        permissions: [],
      },
      {
        name: 'user',
        description: 'Normal user with limited access',
        isActive: true,
        permissions: [],
      },
    ];

    return this.roleModel.insertMany(roleDtos);
  }

  private async createUsers(roles: RoleDocument[]): Promise<UserDocument[]> {
    const hashedPassword = await argon2.hash('Password123!');
    const adminRole = roles.find((r) => r.name === 'admin');
    const userRole = roles.find((r) => r.name === 'user');

    if (!adminRole || !userRole) throw new Error('Roles not created');

    const userDtos: CreateUserDto[] = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: adminRole._id,
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: hashedPassword,
        role: userRole._id,
      },
    ];

    return this.userModel.insertMany(userDtos);
  }

  private async createPermissions(
    createdBy: UserDocument,
  ): Promise<PermissionDocument[]> {
    // Attach createdBy to each mock permission
    const payload = mockPermissions.map((p) => ({
      ...p,
      createdBy: {
        _id: createdBy._id,
        email: createdBy.email,
      },
    }));
    return this.permissionModel.insertMany(payload);
  }

  private async updateAdminRole(
    adminRoleId: string,
    permissions: PermissionDocument[],
  ): Promise<void> {
    const permissionIds = permissions.map((p) => p._id);
    await this.roleModel.findByIdAndUpdate(
      adminRoleId,
      { $set: { permissions: permissionIds } },
      { new: true },
    );
  }
}
