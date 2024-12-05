import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EmployeeRole } from "src/common/constants/enum.constant";
import { AUTH_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { Roles } from "src/common/decorators/role.decorator";
import { ResponseMessage } from "../../common/decorators/response.decorator";
import { ChangePasswordDto, LoginDto } from "../../common/dto/common.dto";
import { Public } from "./auth.decorator";
import { AuthService } from "./auth.service";
import { RoleGuard } from "./guards/role.guard";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ResponseMessage(AUTH_RESPONSE_MESSAGES.EMPLOYEE_LOGIN)
  @HttpCode(HttpStatus.OK)
  @Post("/login")
  async login(@Body() params: LoginDto) {
    return await this.authService.login(params);
  }

  @Post("/changePassword")
  @ApiBearerAuth()
  @Roles(EmployeeRole.ADMIN, EmployeeRole.EMPLOYEE)
  @UseGuards(RoleGuard)
  @ResponseMessage(AUTH_RESPONSE_MESSAGES.EMPLOYEE_CHANGE_PASSWORD)
  async changePassword(@Body() body: ChangePasswordDto) {
    return this.authService.changePassword(body);
  }
}
