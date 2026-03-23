import { Controller, Get, Post, Body, Param, Delete, Query, Put, Headers } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiDefaultResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiResponseExample } from '@core-config/config';
import { Roles } from '@core-decorators/roles.decorator';
import { Role } from '@core-enum/role.enum';
import { PublicRoute } from '@core-decorators/public-route.decorator';
import { IMessage } from '@core-interface/interface';
import { ResponseMessageTransformer } from '@core-transformers/response-message.transformer';
import { BaseFilterDto } from '@core-base-dto/base-filter.dto';
import { RestaurantTransformer } from '@core-transformers/restaurant.transformer';

@ApiTags('Restaurant')
@Controller({ path: 'restaurants', version: '1' })
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({
    description: 'Create a new restaurant',
    summary: 'Create Restaurant (ADMIN)',
  })
  @ApiSecurity('Authentication - Bearer jwt_token')
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<IMessage> {
    await this.restaurantService.create(createRestaurantDto);

    return {
      message: ResponseMessageTransformer.restaurant.success.create
    }
  }

  @ApiOperation({
    description: 'Get all restaurants',
    summary: 'Get All Restaurants',
  })
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @PublicRoute()
  @Get()
  async findAll(@Query() baseFilterDto: BaseFilterDto): Promise<RestaurantTransformer> {
    return await this.restaurantService.findAll(baseFilterDto);
  }

  @ApiOperation({
    description: 'Get detail restaurant',
    summary: 'Get Detail Restaurant',
  })
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @PublicRoute()
  @Get(':id')
  async findOne(@Param('id') id: string, @Headers() headers: any): Promise<RestaurantTransformer> {
    return await this.restaurantService.findOne(id, headers);
  }

  @ApiOperation({
    description: 'Update a restaurant',
    summary: 'Update Restaurant (ADMIN)',
  })
  @ApiSecurity('Authentication - Bearer jwt_token')
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRestaurantDto: CreateRestaurantDto): Promise<IMessage> {
    await this.restaurantService.update(id, updateRestaurantDto);

    return {
      message: ResponseMessageTransformer.restaurant.success.update
    }
  }

  @ApiOperation({
    description: 'Delete a restaurant',
    summary: 'Delete Restaurant (ADMIN)',
  })
  @ApiSecurity('Authentication - Bearer jwt_token')
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IMessage> {
    await this.restaurantService.remove(id);

    return {
      message: ResponseMessageTransformer.restaurant.success.delete
    }
  }
}
