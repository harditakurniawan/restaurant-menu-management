import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DataServicesModule } from '@database/data-service.module';
import { UtilsModule } from '@utils/utils.module';
import { JwtService } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@core-guards/jwt-auth.guard';
import { AllExceptionsFilter } from './core/exceptions/all-exception.filter';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseInitService } from './database/config/database-init.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule,
    DataServicesModule,
    ScheduleModule.forRoot(),
    UtilsModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [
    DatabaseInitService,
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
