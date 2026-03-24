import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';
import { DataServicesModule } from '@database/data-service.module';
import { PaginationMiddleware } from '@core-middleware/pagination.middleware';

@Module({
  imports: [
    DataServicesModule,
  ],
  controllers: [MenuItemController],
  providers: [MenuItemService],
  exports: [MenuItemService]
})
export class MenuItemModule {}