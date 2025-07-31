import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  page: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  limit: number;

  [key: string]: any;
}
