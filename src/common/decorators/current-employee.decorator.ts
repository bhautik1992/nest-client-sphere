import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentEmployee = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user; // The employee is attached by Passport after validating the token
  },
);
