import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, response, Response } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) { }
  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      const { url, method } = req
      const { statusCode } = response

      const logData = {
        url, method
      }
      const logMessage = `${url} ${method}`
      if (statusCode === 500) {
        this.loggerService.error(logMessage, 'HTTP')
      }
      else if (statusCode >= 400) {
        this.loggerService.warn(logMessage, 'HTTP', logData)
      } else {
        this.loggerService.log(logMessage, 'HTTP', logData)
      }
    })
    next();
  }
}
