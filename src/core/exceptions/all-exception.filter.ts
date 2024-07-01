import { httpMessage, PrefixLogFileName } from '../config/config';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Utils } from '@utils/utils.service';
import { ILogContent } from '@core-interface/interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('HTTP');

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly utils: Utils,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const responseBody = {
      meta: {
          statusCode  : null,
          status      : null,
          message     : null,
          url         : null,
      },
      data: null
    };

    const { httpAdapter } = this.httpAdapterHost;

    const ctx         = host.switchToHttp();
    const request     = ctx.getRequest<FastifyRequest>();
    const response    = host.switchToHttp().getResponse<FastifyReply>();
    const httpStatus  = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const meta        = exception instanceof HttpException ? exception.getResponse() : [(exception as Error).message.toString()];

    if (!Array.isArray(meta)) {
      meta['message'] = Array.isArray(meta['message'])
        ? meta['message']
        : [meta['message']];
    } else {
      meta['message'] = meta;
    }

    responseBody.meta = {
        statusCode  : httpStatus,
        status      : httpMessage[httpStatus],
        message     : meta['message'],
        url         : httpAdapter.getRequestUrl(request),
    };

    const prefixName = this.utils.isClientError(httpStatus) ? PrefixLogFileName.error_client : PrefixLogFileName.error_server;
    const errorLog   = this.getErrorLog(
      responseBody['meta'],
      request,
      exception,
    );

    this.logger.error(errorLog);

    this.utils.writeLogToFile(`${this.utils.currentTimeAsiaJakarta().format('YYYY_MM_DD')}_${prefixName}.log`, errorLog);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

    response.status(httpStatus).send(responseBody);
  }

  private getErrorLog = (errorResponse: any, request: FastifyRequest, exception: unknown): string => {
    const { method, url, ip, headers, body, query, id: requestId, hostname } = request;
    const { statusCode, error } = errorResponse;
    
    const userAgent = headers['user-agent'] || '';

    const detailPayload = method !== 'GET' 
    ? `request body: ${JSON.stringify(body)}\n\n`
    : `request query: ${JSON.stringify(query)}\n\n`;

    const logContent: ILogContent = {
      request_id       : requestId,
      request_time     : this.utils.currentTimeAsiaJakarta().format('YYYY-MM-DDTHH:mm:ss.SSS'),
      request_ip       : ip,
      host_name        : hostname,
      user_agent       : userAgent,
      request_method   : method,
      request_url      : url,
      request_body     : body,
      response_time    : null,
      response_code    : statusCode,
      response_message : httpMessage[statusCode],
      response_body    : errorResponse,
      stack            : exception instanceof HttpException ? exception.stack : error,
    };

    return `${JSON.stringify(logContent)}\n`;

    // return `
    //   ${this.utils.currentTimeAsiaJakarta().format('YYYY-MM-DD HH:mm:ss.SSS')}, Request ID: ${requestId}, Response Code: ${statusCode} - Method: ${method} - URL: ${url} - IP: ${ip} - User Agen: ${userAgent},\n\n
    //   ${detailPayload}
    //   response: ${JSON.stringify(errorResponse)}\n\n
    //   ${exception instanceof HttpException ? exception.stack : error}\n\n
    //   ====================================================================================================================================================
    // `;
  };
}