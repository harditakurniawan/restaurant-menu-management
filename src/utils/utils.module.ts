import { Module } from '@nestjs/common';
import { Utils } from './utils.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [Utils],
  exports: [Utils],
})
export class UtilsModule {}
