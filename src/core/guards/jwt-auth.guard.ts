import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { Utils } from '@utils/utils.service';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { IS_PUBLIC_KEY } from '@core-decorators/public-route.decorator';
import { AppConfig } from '@core-config/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly _utils: Utils;

    constructor(
        protected readonly repositoryService : IDataService,
        protected readonly jwtService        : JwtService,
        private reflector                    : Reflector,
    ) {
        super();
        this._utils = new Utils();
    }
    
    async canActivate(context: ExecutionContext) {
        const request       = context.switchToHttp().getRequest();
        const token         = this.extractTokenFromHeader(request);
        const isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublicRoute) {
            return true;
        }

        if (this._utils.isNull(token)) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                algorithms: ['RS256'],
                ignoreExpiration: false,
                secret: AppConfig.JWT_PRIVATE_KEY,
            });
            
            request.user        = payload;
            // const existingToken = await this.repositoryService.accessTokens.isExist({ token });

            // if (this._utils.isNull(existingToken)) {
            //     throw new UnauthorizedException();
            // }

        } catch (error) {
            throw new UnauthorizedException(error.message);
        }

        return true;
    }

    private extractTokenFromHeader(request: FastifyRequest): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
