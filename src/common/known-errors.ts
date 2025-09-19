import { ErrorCode, errors, getErrorNameByCode } from '../errors';

export class KnownError implements Error {
  constructor(status: number, errorCode: ErrorCode, message: string) {
    this.status = status;
    this.code = errorCode;
    this.name = getErrorNameByCode(errorCode);
    this.message = message;
    this.stack = new Error().stack;
  }

  status: number;
  code: ErrorCode;
  message: string;
  name: string;
  stack?: string;
}

export const knownErrors = {
  InvalidInputError: (message = '잘못된 입력입니다.') => {
    return new KnownError(400, errors.BadRequestParameterError, message);
  },
  InvalidDomainError: (message = '잘못된 도메인입니다.') => {
    return new KnownError(400, errors.InvalidDomainError, message);
  },
  BadRequestError: (message = '잘못된 요청입니다.') => {
    return new KnownError(400, errors.BadRequestError, message);
  },
  RefreshTokenExpiredError: (message = '리프레시 토큰이 만료되었습니다.') => {
    return new KnownError(400, errors.TokenExpiredError, message);
  },
  TokenExpiredError: (message = '토큰이 만료되었습니다.') => {
    return new KnownError(401, errors.TokenExpiredError, message);
  },
  JsonWebTokenError: (message = '잘못된 토큰입니다.') => {
    return new KnownError(401, errors.InvalidAccessTokenError, message);
  },
  ForbiddenError: (message = '권한이 없습니다.') => {
    return new KnownError(403, errors.ForbiddenError, message);
  },
  DataNotExistError: (message = '요청한 데이터가 존재하지 않습니다.') => {
    return new KnownError(404, errors.DataNotExistsError, message);
  },
  NotFoundError: (message = '데이터를 찾을 수 없습니다.') => {
    return new KnownError(404, errors.NotFoundError, message);
  },
  RequestTimeOutError: (message = '요청 시간이 초과되었습니다') => {
    return new KnownError(408, errors.RequestTimeout, message);
  },
  DuplicatedRequestError: (message = '중복 요청입니다.') => {
    return new KnownError(409, errors.DuplicatedRequestError, message);
  },
  DBError: (message = '데이터베이스 에러입니다.') => {
    return new KnownError(500, errors.DbError, message);
  },
  InternalError: (message = '서버내부 에러입니다.') => {
    return new KnownError(500, errors.InternalError, message);
  },
  ExternalApiResponseError: (message = '외부 API 응답 에러입니다.') => {
    return new KnownError(500, errors.ExternalApiResponseError, message);
  },
  ProxyError: (status = 502, message = '프록시 요청 에러입니다.') => {
    return new KnownError(status, errors.ProxyRequestError, message);
  },
  GatewayTimeOutError: (timeout?: number) => {
    return new KnownError(
      504,
      errors.GatewayTimeOut,
      `axios 응답 대기시간이 초과되었습니다. Timeout : ${timeout} ms`,
    );
  },
};
