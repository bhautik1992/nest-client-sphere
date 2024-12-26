import { HttpException, HttpStatus } from "@nestjs/common";

export const TypeExceptions = {
  EmployeeNotFound(): HttpException {
    return new HttpException(
      {
        message: "Employee not found",
        error: "Not Found",
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  },

  EmployeeAlreadyExists(): HttpException {
    return new HttpException(
      {
        message: "Employee email already exists",
        error: "EmployeeAlreadyExists",
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  },

  InvalidFile(): HttpException {
    return new HttpException(
      {
        message: "Uploaded file is invalid",
        error: "InvalidFile",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },
};
