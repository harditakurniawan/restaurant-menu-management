import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseFilterDto } from '@core-base-dto/base-filter.dto';
import { CategoryTransformer } from '@core-transformers/category.transformer';
import { IDataService } from '@core-abstraction/data-service.abstract';

@Injectable()
export class CategoryService {
  constructor(protected readonly repositoryService: IDataService) {}

  public async findAll(baseFilterDto: BaseFilterDto): Promise<CategoryTransformer> {
    try {
      const { filter, page, perPage } = baseFilterDto;
      const {
        condition,
        pagination: { order, take, skip },
      } = filter;

      const queryCondition = {
          where       : { ...condition },
          relations   : [],
          order,
          take,
          skip,
      };

      const [categories, totalRecords] = await Promise.all([
        this.repositoryService.categories.getAll(queryCondition),
        this.repositoryService.categories.count(queryCondition)
      ]);

      return {
        last_page   : perPage !== 0 ? Math.ceil(totalRecords / perPage) : 0,
        per_page    : perPage,
        page        : page,
        total       : totalRecords,
        data        : CategoryTransformer.transform(categories),
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
