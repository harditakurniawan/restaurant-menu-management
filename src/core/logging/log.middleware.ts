import { PrefixLogFileName } from '@core-config/config';
import { ILogContent } from '@core-interface/interface';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Utils } from '@utils/utils.service';
import { FastifyRequest, FastifyReply, FastifyInstance, RawServerDefault } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private utils  = new Utils();
  private logger = new Logger('HTTP');

  use(request: FastifyRequest['raw'], response: FastifyReply['raw'], next: Function): void {
    const startTime     = this.utils.currentTimeAsiaJakarta().format('YYYY-MM-DDTHH:mm:ss.SSS');
    const start         = process.hrtime();
    const { headers }   = request;
    const ip            = request['ip'];
    const method        = request['method'];
    const originalUrl   = request['originalUrl'];
    const userAgent     = headers['user-agent'];
    
    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      const endTime       = this.utils.currentTimeAsiaJakarta().format('YYYY-MM-DDTHH:mm:ss.SSS');
      const diff          = process.hrtime(start);
      const responseTime  = diff[0] * 1e3 + diff[1] * 1e-6;

      const message = `start: ${startTime}, end: ${endTime}, response time: ${responseTime}, ip: ${ip}, userAgent: ${userAgent}, method: ${method}, originalUrl: ${originalUrl}, statusCode: ${statusCode}, statusMessage: ${statusMessage}\n`;

      this.utils.writeLogToFile('app.log', message);

      if (statusCode !== 200 && statusCode !== 201) {
        return this.logger.error(message);
      }

      this.logger.log(message);
    });

    next();
  }
}

export function FnLoggerMiddleware(request: FastifyRequest, response: FastifyReply['raw'], next: Function): void {
  const utils         = new Utils();
  const logger        = new Logger('HTTP');
  const startTime     = utils.currentTimeAsiaJakarta().format('YYYY-MM-DDTHH:mm:ss.SSS');
  const start         = process.hrtime();
  const { headers }   = request;
  const ip            = request['ip'];
  const method        = request['method'];
  const originalUrl   = request['originalUrl'];
  const userAgent     = headers['user-agent'];

  response.on('finish', () => {
    const { statusCode, statusMessage } = response;
    const endTime       = utils.currentTimeAsiaJakarta().format('YYYY-MM-DDTHH:mm:ss.SSS');
    const diff          = process.hrtime(start);
    const responseTime  = diff[0] * 1e3 + diff[1] * 1e-6;

    const message = `start: ${startTime}, end: ${endTime}, response time: ${responseTime}, ip: ${ip}, userAgent: ${userAgent}, method: ${method}, originalUrl: ${originalUrl}, statusCode: ${statusCode}, statusMessage: ${statusMessage}\n`;

    utils.writeLogToFile('app.log', message);

    if (statusCode !== 200 && statusCode !== 201) {
      return logger.error(message);
    }

    logger.log(message);
  });

  next();
};

export async function WriteLogMiddleware(request: FastifyRequest, response: FastifyReply): Promise<void> {
  const { id: requestId, headers, body, originalUrl, method, ip: requestIp, hostname } = request;
  const { statusCode: responseCode, elapsedTime: responseTime } = response;

  const prefixName      = PrefixLogFileName.default;
  const utils           = new Utils();
  const logger          = new Logger('HTTP');
  const requestTime     = utils.currentTimeAsiaJakarta().format('YYYY-MM-DDTHH:mm:ss.SSS');
  const userAgent       = headers['user-agent'];
  const responseMessage = response.raw.statusMessage;

  const message = `requestId: ${requestId}, requestTime: ${requestTime}, requestIp: ${requestIp}, userAgent: ${userAgent}, method: ${method}, originalUrl: ${originalUrl}, body: ${JSON.stringify(body)} responseTime: ${responseTime}, statusCode: ${responseCode}, statusMessage: ${responseMessage}\n`;

  const logContent: ILogContent = {
    request_id       : requestId,
    request_time     : requestTime,
    request_ip       : requestIp,
    host_name        : hostname,
    user_agent       : userAgent,
    request_method   : method,
    request_url      : originalUrl,
    request_body     : body,
    response_time    : responseTime,
    response_code    : responseCode,
    response_message : responseMessage, 
    response_body    : null, 
    stack            : null
  };

  utils.writeLogToFile(`${utils.currentTimeAsiaJakarta().format('YYYY_MM_DD')}_${prefixName}.log`, `${JSON.stringify(logContent)}\n`);

  if (responseCode !== 200 && responseCode !== 201) {
    return logger.error(message);
  }

  logger.log(message);
}