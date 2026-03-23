import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SortType } from '../enum/config.enum';
import { IFilter } from '../interface/interface';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 1;

export class BaseFilterDto {
  @ApiProperty({
    description: 'Order by column (default: id)',
    example: 'id',
  })
  @IsString()
  @IsOptional()
  orderBy = 'id';

  @ApiProperty({
    description: 'Sort type (default: desc)',
    enum: SortType,
    example: SortType.DESC,
  })
  @IsString()
  @IsEnum(SortType)
  @IsOptional()
  sortType = SortType.DESC;

  @ApiProperty({
    description: `Page number (default: ${DEFAULT_PAGE})`,
    example: DEFAULT_PAGE,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page = DEFAULT_PAGE;

  @ApiProperty({
    description: `Per page number (default: ${DEFAULT_LIMIT})`,
    example: DEFAULT_LIMIT,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  perPage = DEFAULT_LIMIT;

  @IsOptional()
  filter: IFilter;
}
