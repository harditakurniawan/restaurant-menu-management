import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Utils } from '@utils/utils.service';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class ValidateTokenCodeMiddleware implements NestMiddleware {
    constructor(
        protected readonly util: Utils,
    ){}

    use(request: FastifyRequest['raw'], response: FastifyReply['raw'], next: Function) {
        const { headers }     = request;
        const tokenCode       = headers['token_code'];
        const isTokenCodeNull = this.util.isNull(tokenCode);

        if (isTokenCodeNull) {
            throw new BadRequestException(`token_code can't be null`);
        }

        headers['authorization'] = `Bearer ${tokenCode}`;

        next();
    }
}
