import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthExceptions {
  static TokenExpired(): HttpException {
    return new HttpException(
      {
        message: "Token Expired use RefreshToken",
        error: "TokenExpiredError",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static InvalidToken(): HttpException {
    return new HttpException(
      {
        message: "Invalid Token",
        error: "InvalidToken",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static ForbiddenException(): HttpException {
    return new HttpException(
      {
        message: "This resource is forbidden from this employee",
        error: "UnAuthorizedResourceError",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static InvalidEmployeeId(): HttpException {
    return new HttpException(
      {
        message: "Invalid Employee Id",
        error: "InvalidEmployeeId",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static InvalidIdPassword(): HttpException {
    return new HttpException(
      {
        message: "Invalid Employeename or Password",
        error: "InvalidIdPassword",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  static AccountNotExist(): HttpException {
    return new HttpException(
      {
        message: "Account does not exist!",
        error: "AccountNotExist",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static AccountNotActive(): HttpException {
    return new HttpException(
      {
        message: "Account not active!",
        error: "AccountNotActive",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
