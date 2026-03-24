import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiDefaultResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseExample } from '@core-config/config';
import { PublicRoute } from '@core-decorators/public-route.decorator';
import { CategoryTransformer } from '@core-transformers/category.transformer';
import { BaseFilterDto } from '@core-base-dto/base-filter.dto';

@ApiTags('Category')
@PublicRoute()
@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    description: 'Get all categories',
    summary: 'Get All Categories',
  })
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @Get()
  async findAll(@Query() baseFilterDto: BaseFilterDto): Promise<CategoryTransformer> {
    return await this.categoryService.findAll(baseFilterDto);
  }
}
