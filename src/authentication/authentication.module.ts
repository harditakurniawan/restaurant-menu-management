import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { RegistrationService } from './registration.service';
import { DataServicesModule } from '@database/data-service.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@core-config/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Utils } from '@utils/utils.service';
import { IsUniqueEmailConstraint } from '@core-constraint/is-unique-email.constraint';

@Module({
  imports: [
    DataServicesModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register(jwtConfig),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    RegistrationService,
    LocalStrategy,
    JwtStrategy,
    Utils,
    IsUniqueEmailConstraint,
  ]
})
export class AuthenticationModule {}
