import { DatabaseConfigurationService } from './db-configuration.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [DatabaseConfigurationService],
  exports: [DatabaseConfigurationService],
})
export class DatabaseConfigurationModule {}
