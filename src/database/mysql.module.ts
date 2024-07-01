import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import db_config from './config/db.config';
import { MySQLDataService } from './mysql-data-service';
import { AccessToken } from './entity/access-token.entity';
import { User } from './entity/user.entity';
import { IDataService } from '@core-abstraction/data-service.abstract';

@Module({
  imports: [
    /**
     * Declare Entity
     */
    TypeOrmModule.forFeature([
      AccessToken, 
      User,
    ]),

    /**
     * Declare Connectivity of MySQL
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
