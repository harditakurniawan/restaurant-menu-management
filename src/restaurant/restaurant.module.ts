import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { PaginationMiddleware } from '@core-middleware/pagination.middleware';
import { DataServicesModule } from '@database/data-service.module';
import { AuthenticationModule } from '@authentication/authentication.module';

@Module({
  imports: [
    DataServicesModule,
    AuthenticationModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes({
      path: `v1/restaurants`,
      method: RequestMethod.GET,
    });
  }
}