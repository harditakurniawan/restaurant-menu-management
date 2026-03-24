import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DataServicesModule } from '@database/data-service.module';
import { PaginationMiddleware } from '@core-middleware/pagination.middleware';

@Module({
  imports: [
    DataServicesModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes({
      path: `v1/categories`,
      method: RequestMethod.GET,
    });
  }
}