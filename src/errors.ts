import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AxiosError } from 'axios';
import { Response } from 'express';
import { invert } from 'lodash';
import { KnownError, knownErrors } from './common/known-errors';
import { LoggerService } from './logger/logger.service';

export interface ErrorResponse {
  code: number;
  type: string;
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const knownError: KnownError =
      exception instanceof KnownError
        ? exception
        : this.errorToKnownError(exception);

    if (
      knownError.code != errors.InvalidAccessTokenError &&
      knownError.code != errors.NotFoundError
    )
      this.logger.error(
        `[${knownError.name}] ${knownError.message}`,
        knownError.stack,
      );

    const errorResponse: {
      error: ErrorResponse;
      date: Date;
    } = {
      error: this.getErrorResponseWithKnownError(knownError),
      date: new Date(),
    };
    response.status(knownError.status).json(errorResponse);
    return;
  }

  /**
   *  Nestjs/HttpException 및 PrismaException 을 핸들링합니다.
   */
  errorToKnownError(exception: Error): KnownError {
    if (exception instanceof AxiosError) {
      switch (exception.code) {
        case 'ECONNABORTED':
          return knownErrors.GatewayTimeOutError(exception.config.timeout);
      }
    }

    if (exception instanceof HttpException) {
      switch (exception.getStatus()) {
        case 400:
          return knownErrors.InvalidInputError();
        case 401:
          return knownErrors.JsonWebTokenError();
        case 403:
          return knownErrors.ForbiddenError();
        case 404:
          return knownErrors.NotFoundError();
        case 408:
          return knownErrors.RequestTimeOutError();
      }
    }

    /** @link https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes */
    if (exception instanceof PrismaClientKnownRequestError) {
      this.logger.error('Prisma Known Error');
      this.logger.error(exception);
      return knownErrors.DBError();
    }

    this.logger.error('Unhandled Error');
    this.logger.error(exception);
    return knownErrors.InternalError();
  }

  getErrorResponseWithKnownError(knownError: KnownError): ErrorResponse {
    return {
      type: knownError.name,
      code: knownError.code,
      message: knownError.message,
    };
  }
}

export const errors = {
  InvalidAccessTokenError: 103,
  DuplicatedRequestError: 150,
  InvalidDomainError: 200,

  ProxyRequestError: 600,
  DbError: 700,
  InternalError: 800,

  CashwalkApiError: 2001,
  TokenExpiredError: 2004,
  DataNotExistsError: 2010,
  ExternalApiResponseError: 2011,

  BadRequestParameterError: 2400,
  BadRequestError: 2401,
  ForbiddenError: 2403,
  NotFoundError: 2404,
  RequestTimeout: 2408,
  GatewayTimeOut: 2504,
};

export type ErrorTableType = typeof errors;
export type ErrorCode = ErrorTableType[keyof ErrorTableType];

const errorNameTableByCode = invert(errors);
export function getErrorNameByCode(code: ErrorCode): string {
  return (
    errorNameTableByCode[code] || errorNameTableByCode[errors.InternalError]
  );
}
