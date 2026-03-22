import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from '@core-config/config';
import { Environment } from '@core-enum/environment.enum';

const db_config: TypeOrmModuleOptions = {
  type              : 'postgres',
  host              : AppConfig.DB_HOST,
  port              : AppConfig.DB_PORT,
  database          : AppConfig.DB_NAME,
  username          : AppConfig.DB_USERNAME,
  password          : String(AppConfig.DB_PASSWORD),
  synchronize       : AppConfig.APP_MODE !== Environment.PROD,      // must be false when in production mode
  entities          : [__dirname + '/../entity/*.entity.{js,ts}'],
  logging           : AppConfig.APP_MODE !== Environment.PROD,
  // extra             : { connectionLimit: 10 },
  autoLoadEntities  : AppConfig.APP_MODE === Environment.PROD,
};

export default db_config;
