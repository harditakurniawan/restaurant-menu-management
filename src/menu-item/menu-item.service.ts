import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Restaurant } from '@database/entity/restaurant.entity';
import { Category } from '@database/entity/category.entity';
import { ResponseMessageTransformer } from '@core-transformers/response-message.transformer';
import { PostgresErrorCode } from '@core-config/config';
import { BaseFilterDto } from '@core-base-dto/base-filter.dto';
import { MenuItemTransformer } from '@core-transformers/menu-item.transformer';

@Injectable()
export class MenuItemService {
  constructor(protected readonly repositoryService: IDataService) {}

  /**
   * Create Menu Item
   * 
   * @param id 
   * @param createMenuItemDto 
   */
  public async create(id: string, createMenuItemDto: CreateMenuItemDto): Promise<void> {
    try {
      const { category_id, ...payloadCreateMenuItem } = createMenuItemDto;

      const newMenuItem = this.repositoryService.menuItems.createEntity({
        ...payloadCreateMenuItem,
        restaurant: { id } as Restaurant,
        category: { id: category_id } as Category,
      });

      await this.repositoryService.menuItems.save(newMenuItem);
    } catch (error) {
      if (error.code === PostgresErrorCode.FOREIGN_KEY_VIOLATION) {
        const detail = error.detail || '';

        if (detail.includes('category_id')) throw new BadRequestException(ResponseMessageTransformer.menu_item.error.category_not_found);
        if (detail.includes('restaurant_id')) throw new BadRequestException(ResponseMessageTransformer.menu_item.error.restaurant_not_found);

        throw new BadRequestException(ResponseMessageTransformer.menu_item.error.related_resource_not_found);
      }

      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Find All Menu Item
   * 
   * @param restaurantId 
   * @param baseFilterDto 
   * @returns 
   */
  public async findAll(id: string, baseFilterDto: BaseFilterDto): Promise<MenuItemTransformer> {
    try {
      const { filter, page, perPage } = baseFilterDto;
      const {
        condition,
        pagination: { order, take, skip },
      } = filter;

      const queryCondition = {
          where       : { restaurant: { id }, ...condition },
          relations   : ['category'],
          order,
          take,
          skip,
      };

      const { relations, ... queryConut} = queryCondition;

      const [menuItems, totalRecords] = await Promise.all([
        this.repositoryService.menuItems.getAll(queryCondition),
        this.repositoryService.menuItems.count(queryConut)
      ]);

      return {
        last_page   : perPage !== 0 ? Math.ceil(totalRecords / perPage) : 0,
        per_page    : perPage,
        page        : page,
        total       : totalRecords,
        data        : MenuItemTransformer.transform(menuItems),
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Update Menu Item
   * 
   * @param id 
   * @param updateMenuItemDto 
   */
  public async update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<void> {
    try {
      const { category_id, restaurant_id, ...payloadUpdateMenuItem } = updateMenuItemDto;

      const newMenuItem = this.repositoryService.menuItems.createEntity({
        ...payloadUpdateMenuItem,
        restaurant: { id: restaurant_id } as Restaurant,
        category: { id: category_id } as Category,
      });

      const updateResult = await this.repositoryService.menuItems.update({ id }, newMenuItem);

      if (updateResult.affected === 0) {
        throw new NotFoundException(ResponseMessageTransformer.menu_item.error.not_found)
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error)
      }

      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Delete Menu Item
   * 
   * @param id 
   */
  public async remove(id: string): Promise<void> {
    try {
      const deleteResult = await this.repositoryService.menuItems.deleteOne({ id });

      if (deleteResult.affected === 0) {
        throw new NotFoundException(ResponseMessageTransformer.menu_item.error.not_found)
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error)
      }

      throw new InternalServerErrorException(error)
    }
  }
}
