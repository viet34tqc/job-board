import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  apiPath: string;

  @IsIn(['GET', 'POST', 'PUT', 'DELETE'])
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  @IsString()
  module: string;
}
