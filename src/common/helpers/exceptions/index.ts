import { HttpException, HttpStatus } from "@nestjs/common";

export * from "./auth.exception";
export * from "./type.exception";
export * from "./connection.exception";

export function CustomError(
  message?: string,
  statusCode?: number,
): HttpException {
  return new HttpException(
    {
      message: message || "Something went wrong, please try again later!",
      error: "CustomError",
      statusCode: statusCode || HttpStatus.BAD_GATEWAY,
    },
    HttpStatus.BAD_GATEWAY,
  );
}
