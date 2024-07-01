import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import db_config from './config/db.config';
import { MySQLDataService } from './mysql-data-service';
import { AccessToken } from './entity/access-token.entity';
import { User } from './entity/user.entity';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Role } from './entity/role.entity';
import { Permission } from './entity/permission.entity';

@Module({
  imports: [
    /**
     * Declare Entity
     */
    TypeOrmModule.forFeature([
      AccessToken,
      Permission,
      Role,
      User,
    ]),

    /**
     * Declare Connectivity of PgSQL
     */
    TypeOrmModule.forRootAsync({ useFactory: async () => db_config }),
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
