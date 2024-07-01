import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';
import { Utils } from '@utils/utils.service';
import { ErrorMessageExpression } from '@core-enum/error-message-expression.enum';

@Injectable()
export class DecryptPayloadInterceptor implements NestInterceptor {
    constructor(private utils: Utils) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const request       = context.switchToHttp().getRequest<FastifyRequest>();
        const { body }      = request;
        const isValidFormat = body.hasOwnProperty('bakso');

        if (this.utils.isNull(body) || !isValidFormat) {
            throw new BadRequestException(ErrorMessageExpression.NOT_ACCEPTABLE_PAYLOAD);
        }

        const decriptedPayload  = this.utils.decryptPayloadFE(body['bakso']);
        request['body']         = decriptedPayload;

        return next.handle();
    }
}