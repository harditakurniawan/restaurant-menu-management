import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '@core-base-dto/base-response.dto';
import { ILogContent, IResponse } from '@core-interface/interface';
import { httpMessage, PrefixLogFileName } from '@core-config/config';
import { ErrorMessageExpression } from '@core-enum/error-message-expression.enum';
import { Utils } from '@utils/utils.service';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    const prefixName    = PrefixLogFileName.success;
    const request       = context.switchToHttp().getRequest();
    const response      = context.switchToHttp().getResponse();
    const requestId     = request.id;
    const requestIp     = request.ip;
    const hostName      = request.hostname;
    const userAgent     = request.raw.rawHeaders;
    const requestMethod = request.method;
    const currentUrl    = request.url;
    const requestBody   = request.body;
    const statusCode    = response.statusCode;
    const utils         = new Utils();

    return next.handle().pipe(
      map((rawData: any) => {
          const { _requestContext, ...data } = rawData;

          const response: BaseResponseDto = {
            meta: {
              status_code : statusCode,
              status      : httpMessage[statusCode],
              message     : [],
              url         : currentUrl,
              last_page   : data?.last_page || 0,
              per_page    : data?.per_page || 0,
              page        : data?.page || 0,
              total       : data?.total || 0,
            },
            data: data?.data ? data?.data : data || ErrorMessageExpression.NO_DATA,
          };

          const logContent: ILogContent = {
            request_id       : requestId,
            request_time     : utils.currentTimeAsiaJakarta().format('YYYY-MM-DDTHH:mm:ss.SSS'),
            request_ip       : requestIp,
            host_name        : hostName,
            user_agent       : userAgent,
            request_method   : requestMethod,
            request_url      : currentUrl,
            request_body     : requestBody,
            response_time    : null,
            response_code    : response.meta.status_code,
            response_message : response.meta.status, 
            response_body    : response, 
            stack            : null
          };

          utils.writeLogToFile(`${utils.currentTimeAsiaJakarta().format('YYYY_MM_DD')}_${prefixName}.log`, `${JSON.stringify(logContent)}\n`);

          return response;
        }
      ),
    );
  }
}
