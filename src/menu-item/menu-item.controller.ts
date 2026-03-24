import { Controller, Body, Param, Delete, Put } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { ApiDefaultResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiResponseExample } from '@core-config/config';
import { Roles } from '@core-decorators/roles.decorator';
import { Role } from '@core-enum/role.enum';
import { IMessage } from '@core-interface/interface';
import { ResponseMessageTransformer } from '@core-transformers/response-message.transformer';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

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
  @Put(':id')
  async update(@Param('id') menuItemId: string, @Body() updateMenuItemDto: UpdateMenuItemDto): Promise<IMessage> {
    await this.menuItemService.update(menuItemId, updateMenuItemDto);

    return {
      message: ResponseMessageTransformer.menu_item.success.update,
    }
  }

  @ApiOperation({
    description: 'Delete a menu item',
    summary: 'Delete Menu Item (ADMIN)',
  })
  @ApiSecurity('Authentication - Bearer jwt_token')
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @Delete(':id')
  async remove(@Param('id') menuItemId: string): Promise<IMessage> {
    await this.menuItemService.remove(menuItemId);

    return {
      message: ResponseMessageTransformer.menu_item.success.delete,
    }
  }
}
