import { IDataService } from '@core-abstraction/data-service.abstract';
import { AppConfig, jwtConfig } from '@core-config/config';
import { ErrorMessageExpression } from '@core-enum/error-message-expression.enum';
import { IAuth } from '@core-interface/interface';
import { AccessToken } from '@database/entity/access-token.entity';
import { User } from '@database/entity/user.entity';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Utils } from '@utils/utils.service';

@Injectable()
export class AuthenticationService {
    protected readonly _jwtService: JwtService;

    constructor(
        protected readonly repositoryService    : IDataService,
        protected readonly utils                : Utils,
    ) {
        this._jwtService = new JwtService(jwtConfig);
    }

    /**
     * Validate user (local - strategy)
     * 
     * @param email 
     * @param password 
     * @returns 
     */
    public async validateUser(email: string, password: string): Promise<User | null> {
        try {
            const user = await this.repositoryService.users.findOne({ where: { email }, relations: ['roles', 'roles.permissions'] });

            if (this.utils.isNull(user)) {
                return null;
            }

            const isPasswordMatch = user && user.password ? user.comparePassword(password) : false;

            if (!isPasswordMatch) {
                throw new BadRequestException(ErrorMessageExpression.PASSWORD_INCORRECT);
            }

            return user;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * Generate token
     * 
     * @param user 
     * @returns 
     */
    public async generateToken(user: User): Promise<string> {
        try {
            const { id, email, roles } = user;
            const rolesNames = roles.map(data => data.name);
            const permission = roles.flatMap(role => role.permissions.map(permission => permission.name));
            const auth  = { id, email, roles: rolesNames, permission } as IAuth;
            const token = this._jwtService.sign(auth);

            return token;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * Set one login one device
     * 
     * @param user 
     * @param token 
     */
    public async updateToken(user: User, token: string): Promise<void> {
        try {
            await this.repositoryService.accessTokens.createQueryBuilder()
            .insert()
            .into(AccessToken)
            .values({ user, token })
            .orUpdate(['token'], ['user_id'])
            .execute();
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * Sign out
     * 
     * @param auth 
     */
    public async signOut(auth: IAuth): Promise<void> {
        try {
            const { id } = auth;

            await this.repositoryService.accessTokens.deleteOne({ user: { id } });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * Validate token
     * 
     * @param headerToken 
     * @returns 
     */
    public async validateAndExtractToken(headerToken: string): Promise<IAuth> {
        let token = headerToken;

        token = token.replace(/^Bearer\s/, '');
        const existingToken = await this.repositoryService.accessTokens.isExist({ token });

        if (this.utils.isNull(existingToken)) {
            return;
        }

        return this.extractedToken(token);
    }

    /**
     * Extract payload jwt token
     * 
     * @param token 
     * @returns 
     */
    public async extractedToken(token: string): Promise<IAuth> {
        try {
            const payload: IAuth = await this._jwtService.verifyAsync(token, {
                algorithms: ['RS256'],
                ignoreExpiration: false,
                secret: AppConfig.JWT_PRIVATE_KEY,
            });

            return payload;
        } catch (error) {
            console.error(`error extrac token ${error.message}`);
            return null;
        }
    }
}
