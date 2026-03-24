import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SortType } from '../enum/config.enum';
import { IFilter } from '../interface/interface';

export const DEFAULT_ORDER_BY = 'id';
export const DEFAULT_SORT_TYPE = SortType.DESC;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 1;

export class BaseFilterDto {
  @ApiProperty({
    description: 'Order by column (default: id)',
    example: DEFAULT_ORDER_BY,
  })
  @IsString()
  @IsOptional()
  orderBy = DEFAULT_ORDER_BY;

  @ApiProperty({
    description: 'Sort type (default: desc)',
    enum: SortType,
    example: DEFAULT_SORT_TYPE,
  })
  @IsString()
  @IsEnum(SortType)
  @IsOptional()
  sortType = DEFAULT_SORT_TYPE;

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
