import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/common/constants/enum.constant";
import { USER_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { Roles } from "src/common/decorators/role.decorator";
import { ListDto } from "src/common/dto/common.dto";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { ResponseMessage } from "../common/decorators/response.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("user")
@ApiTags("User")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_INSERTED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("list")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_LISTED)
  @HttpCode(HttpStatus.OK)
  async findAll(@Body() params: ListDto) {
    return await this.usersService.findAll(params);
  }

  @Get("get/:id")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_FETCHED)
  findOne(@Param("id") id: number) {
    return this.usersService.findOne(id);
  }

  @Post("update/:id")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RoleGuard)
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_UPDATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete("delete/:id")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_DELETED)
  remove(@Param("id") id: number) {
    return this.usersService.remove(id);
  }
}
