import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import winston, { createLogger, format, transports } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly winstonLogger: winston.Logger;

  constructor() {
    this.winstonLogger = createLogger({
      level: 'debug',
      exitOnError: false,
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json(),
      ),
      transports: [new transports.Console()],
    });
  }

  debug = (message: any, ...meta: any[]) =>
    this.winstonLogger.debug(message, meta);

  error = (message: any, ...meta: any[]) =>
    this.winstonLogger.error(message, meta);

  log = (message: any, ...meta: any[]) =>
    this.winstonLogger.info(message, meta);

  verbose = (message: any, ...meta: any[]) =>
    this.winstonLogger.verbose(message, meta);

  warn = (message: any, ...meta: any[]) =>
    this.winstonLogger.warn(message, meta);
}
