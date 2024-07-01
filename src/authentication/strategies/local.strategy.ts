import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';
import { User } from '@database/entity/user.entity';
import { Utils } from '@utils/utils.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authenticationService: AuthenticationService,
    private utils: Utils,
  ) {
    super({
      usernameField: 'email',
    });
  }

  validate = async (email: string, password: string): Promise<User> => {
    const user = await this.authenticationService.validateUser(email, password);

    if (this.utils.isNull(user)) {
      throw new UnauthorizedException('user not found');
    }

    return user;
  };
}
