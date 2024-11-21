import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ListDto } from "src/common/dto/common.dto";
import { RESPONSE_MESSAGES } from "../common/constants/response.constant";
import { ResponseMessage } from "../common/decorators/response.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("users")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  @ResponseMessage(RESPONSE_MESSAGES.USER_INSERTED)
  @ApiOperation({
    description: `
    This API will be used for creating new user using the admin panel.

    Figma Screen Reference: AP - User 1.0 To 1.6
        
    Below is the flow:

    1). Check email is exist OR not in tbl_user table if the user is already exist then give the error response with **This email is already registered with us.** Otherwise we have to insert the new user into the tbl_user table also we need to create a JWT token for the user and returning to the response.

    2). Password should be encrypted while storing the user information into the database.
    `,
  })
  @ApiOkResponse({
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.USER_INSERTED,
        data: {
          firstName: "string",
          lastName: "string",
          gender: "string",
          email: "string",
          accessToken: "string",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "This email is already registered with us.",
        data: {},
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("getAll")
  @ResponseMessage(RESPONSE_MESSAGES.USER_LISTED)
  @HttpCode(HttpStatus.OK)
  async findAll(@Body() params: ListDto) {
    return await this.usersService.findAll(params);
  }

  @Get("get/:id")
  @ResponseMessage(RESPONSE_MESSAGES.USER_LISTED)
  findOne(@Param("id") id: number) {
    return this.usersService.findOne(id);
  }

  @Post("update/:id")
  @ResponseMessage(RESPONSE_MESSAGES.USER_UPDATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete("delete/:id")
  @ResponseMessage(RESPONSE_MESSAGES.USER_DELETED)
  remove(@Param("id") id: number) {
    return this.usersService.remove(id);
  }
}
