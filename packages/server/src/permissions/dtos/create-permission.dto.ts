import { PERMISSION_METHOD } from '@base/shared';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  apiPath: string;

  @IsIn(Object.values(PERMISSION_METHOD))
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  @IsString()
  module: string;
}
