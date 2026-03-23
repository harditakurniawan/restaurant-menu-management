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
  providers: [MenuItemService]
})
export class MenuItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes({
      path: `v1/menu-items`,
      method: RequestMethod.GET,
    });
  }
}