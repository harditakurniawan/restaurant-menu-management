import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import db_config from './config/db.config';
import { MySQLDataService } from './mysql-data-service';
import { DatabaseInitModule } from './config/database-init.module';
import { AccessToken } from './entity/access-token.entity';
import { User } from './entity/user.entity';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Role } from './entity/role.entity';
import { Permission } from './entity/permission.entity';
import { Category } from './entity/category.entity';
import { MenuItem } from './entity/menu-item.entity';
import { Restaurant } from './entity/restaurant.entity';

@Module({
  imports: [
    /**
     * Declare Entity
     */
    TypeOrmModule.forFeature([
      AccessToken,
      Category,
      MenuItem,
      Permission,
      Restaurant,
      Role,
      User,
    ]),

    /**
     * Declare Connectivity of PgSQL
     * Injecting DATABASE_INIT forces Nest to evaluate DatabaseInitModule and execute the custom PG setup query first
     */
    TypeOrmModule.forRootAsync({
      imports: [DatabaseInitModule],
      inject: ['DATABASE_INIT'],
      useFactory: async (initSuccess: boolean) => db_config,
    }),
  ],
  providers: [
    {
      provide: IDataService,
      useClass: MySQLDataService,
    },
  ],
  exports: [IDataService],
})
export class MySQLDataServiceModule {}
