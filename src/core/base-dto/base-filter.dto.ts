import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SortType } from '@core-enum/config.enum';

export class BaseFilterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  sortBy: string = '_id';

  @ApiProperty({ enum: SortType })
  @IsString()
  @IsEnum(SortType)
  @IsOptional()
  sortType: string = 'asc';

  @ApiProperty()
  @Min(1)
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page: number = 1;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit: number = 15;
}
