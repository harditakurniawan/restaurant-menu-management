import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ApiDefaultResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiResponseExample } from '@core-config/config';
import { Roles } from '@core-decorators/roles.decorator';
import { Role } from '@core-enum/role.enum';
import { PublicRoute } from '@core-decorators/public-route.decorator';

@ApiTags('Menu Item')
@Roles(Role.ADMIN)
@Controller({ path: 'menu-items', version: '1' })
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @ApiOperation({
    description: 'Update a menu item',
    summary: 'Update Menu Item (ADMIN)',
  })
  @ApiSecurity('Authentication - Bearer jwt_token')
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemService.update(+id, updateMenuItemDto);
  }

  @ApiOperation({
    description: 'Delete a menu item',
    summary: 'Delete Menu Item (ADMIN)',
  })
  @ApiSecurity('Authentication - Bearer jwt_token')
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(+id);
  }
}
