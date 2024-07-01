import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { Utils } from '@utils/utils.service';
import { AppConfig } from '@core-config/config';

@Injectable()
export class ValidateXApiKeyMiddleware implements NestMiddleware {
    constructor(
        protected readonly util: Utils,
        protected readonly configService: ConfigService,
    ){}

    use(request: FastifyRequest['raw'], response: FastifyReply['raw'], next: Function) {
        // const { headers }   = request;
        // const XApiKey = headers['x-api-key'];
        // const validXApiKey = AppConfig.APP_NAME;

        // const isXApiKeyNull = this.util.isNull(XApiKey);

        // if (isXApiKeyNull) {
        //     throw new BadRequestException(`API Key can't be null`);
        // }

        // if (validXApiKey !== XApiKey) {
        //     throw new BadRequestException(`Forbidden: Invalid API Key`);
        // }

        // next();
    }
}
