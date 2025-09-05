import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/permission.schema';
import { Role, RoleSchema } from 'src/roles/role.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MockController } from './mock.controller';
import { MockService } from './mock.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  providers: [MockService],
  controllers: [MockController],
})
export class MockModule {}
