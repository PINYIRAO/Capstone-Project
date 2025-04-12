import { HTTP_STATUS } from "../../../constants/httpConstants";
// define error classes
export class ExtendedError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = new.target.name;
  }
}

export class RepositoryError extends ExtendedError {
  constructor(
    message: string,
    code: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    super(message, code, statusCode);
  }
}

export class ServiceError extends ExtendedError {
  constructor(
    message: string,
    code: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    super(message, code, statusCode);
  }
}

export class ValidationError extends ExtendedError {
  constructor(
    message: string,
    code: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST
  ) {
    super(message, code, statusCode);
  }
}

export class AuthenticationError extends ExtendedError {
  constructor(
    message: string,
    code: string = "AUTHENTICATION_ERROR",
    statusCode: number = HTTP_STATUS.UNAUTHORIZED
  ) {
    super(message, code, statusCode);
  }
}

export class AuthorizationError extends ExtendedError {
  constructor(
    message: string,
    code: string = "AUTHORIZATION_ERROR",
    statusCode: number = HTTP_STATUS.FORBIDDEN
  ) {
    super(message, code, statusCode);
  }
}
