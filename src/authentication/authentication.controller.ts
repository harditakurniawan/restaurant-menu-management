import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiDefaultResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiResponseExample } from '@core-config/config';
import { PublicRoute } from '@core-decorators/public-route.decorator';
import { IAuth, IMessage } from '@core-interface/interface';
import { RegistrationService } from './registration.service';
import { RegistrationDto } from './dto/registration.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from '@core-decorators/auth.decorator';
import { LoginTransformer } from '@core-transformers/login.transformer';
import { LocalAuthGuard } from '@core-guards/local-guard.guard';
import { User } from '@database/entity/user.entity';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly registrationService: RegistrationService,
  ) {}

  // ================================================================================
  //                                REGISTRATION
  // ================================================================================
  @ApiOperation({
    description: 'Registration',
    summary: 'Registration',
  })
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @PublicRoute()
  @Post('registration')
  async registration(@Body() registrationDto: RegistrationDto): Promise<IMessage> {
    const userRoles = await this.registrationService.getUserRoles();

    registrationDto.roles = userRoles;

    const newUser = await this.registrationService.registration(registrationDto);

    return {
      message : 'user created',
      user    : newUser,
    }
  }


  // ================================================================================
  //                                AUTHENTICATION
  // ================================================================================
  @ApiOperation({
    description: 'Sign in',
    summary: 'Sign In',
  })
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Auth() user: User, @Body() signInDto: SignInDto): Promise<LoginTransformer> {
    const token = await this.authenticationService.generateToken(user);

    // set one login one device
    this.authenticationService.updateToken(user, token);

    return LoginTransformer.singleTransform(token);
  }

  @ApiOperation({
    description: 'Sign out',
    summary: 'Sign Out',
  })
  @ApiDefaultResponse(ApiResponseExample.DEFAULT)
  @ApiSecurity('Authentication - Bearer jwt_token')
  @Post('sign-out')
  async signOut(@Auth() auth: IAuth): Promise<IMessage> {
    await this.authenticationService.signOut(auth);

    return { message: 'sign out success' }
  }
}
