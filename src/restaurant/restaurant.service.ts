import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { ResponseMessageTransformer } from '@core-transformers/response-message.transformer';
import { RestaurantTransformer } from '@core-transformers/restaurant.transformer';
import { BaseFilterDto, DEFAULT_LIMIT } from '@core-base-dto/base-filter.dto';
import { AuthenticationService } from '@authentication/authentication.service';
import { Role } from '@core-enum/role.enum';

@Injectable()
export class RestaurantService {
  constructor(
    protected readonly authenticationService: AuthenticationService,
    protected readonly repositoryService    : IDataService,
  ) {}

  /**
   * Create Restaurant
   * 
   * @param createRestaurantDto 
   * @returns 
   */
  public async create(createRestaurantDto: CreateRestaurantDto): Promise<void> {
    try {
      await this.repositoryService.restaurants.save(createRestaurantDto);
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Find All Restaurant
   * 
   * @param baseFilterDto 
   * @returns 
   */
  public async findAll(baseFilterDto: BaseFilterDto): Promise<RestaurantTransformer> {
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

      const { relations, ... queryConut} = queryCondition;

      const [restaurants, totalRecords] = await Promise.all([
        this.repositoryService.restaurants.getAll(queryCondition),
        this.repositoryService.restaurants.count(queryConut)
      ]);

      return {
        lastPage    : perPage !== 0 ? Math.ceil(totalRecords / perPage) : 0,
        perPage     : perPage,
        page        : page,
        total       : totalRecords,
        data        : RestaurantTransformer.transform(restaurants),
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Find One Restaurant with Menu Items
   * 
   * @param id 
   * @param headers 
   * @returns 
   */
  public async findOne(id: string, headers: any): Promise<RestaurantTransformer> {
    try {
      const authHeader = headers['authorization'];
      const query = this.repositoryService.restaurants
        .createQueryBuilder('r')
        .select([
          'r.id',
          'r.name',
          'r.address',
          'r.phone',
          'r.opening_hour',
          'r.createdAt',
          'r.updatedAt',
        ]);

      if (authHeader) {
        const auth = await this.authenticationService.validateAndExtractToken(authHeader);
        const isAdmin = auth.roles.includes(Role.ADMIN);

        if (!isAdmin) {
          throw new ForbiddenException(ResponseMessageTransformer.restaurant.error.forbidden)
        }

        query.leftJoinAndSelect(
          'r.menuItems', 
          'mi',
          `mi.id IN (SELECT id FROM menu_item WHERE restaurant_id = r.id LIMIT ${DEFAULT_LIMIT})`
        )
        .leftJoinAndSelect('mi.category', 'c');
      } else {
        query.leftJoinAndSelect(
          'r.menuItems', 
          'mi', 
          `mi.id IN (SELECT id FROM menu_item WHERE restaurant_id = r.id AND is_available = true LIMIT ${DEFAULT_LIMIT})`
        );
      }

      const restaurant = await query
        .where('r.id = :id', { id })
        .getOne();

      if (!restaurant) {
        throw new NotFoundException(ResponseMessageTransformer.restaurant.error.not_found)
      }

      return RestaurantTransformer.singleTransform(restaurant);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error)
      }

      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error)
      }

      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Update Restaurant
   * 
   * @param id 
   * @param updateRestaurantDto 
   */
  public async update(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<void> {
    try {
      const updateResult = await this.repositoryService.restaurants.update({ id }, updateRestaurantDto);

      if (updateResult.affected === 0) {
        throw new NotFoundException(ResponseMessageTransformer.restaurant.error.not_found)
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error)
      }

      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Delete Restaurant
   * 
   * @param id 
   */
  public async remove(id: string): Promise<void> {
    try {
      const deleteResult = await this.repositoryService.restaurants.deleteOne({ id });

      if (deleteResult.affected === 0) {
        throw new NotFoundException(ResponseMessageTransformer.restaurant.error.not_found)
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error)
      }

      throw new InternalServerErrorException(error)
    }
  }
}
