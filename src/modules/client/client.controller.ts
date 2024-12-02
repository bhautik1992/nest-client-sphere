import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/common/constants/enum.constant";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { ClientService } from "./client.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { CLIENT_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { ListDto } from "src/common/dto/common.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Controller("client")
@ApiTags("Client")
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RoleGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post("create")
  @ResponseMessage(CLIENT_RESPONSE_MESSAGES.CLIENT_INSERTED)
  async create(@Body() createUserDto: CreateClientDto) {
    return await this.clientService.create(createUserDto);
  }

  @Post("list")
  @ResponseMessage(CLIENT_RESPONSE_MESSAGES.CLIENT_LISTED)
  async findAll(@Body() params: ListDto) {
    return await this.clientService.findAll(params);
  }

  @Get("get/:id")
  @ResponseMessage(CLIENT_RESPONSE_MESSAGES.CLIENT_FETCHED)
  async findOne(@Param("id") id: number) {
    return await this.clientService.findOne(id);
  }

  @Post("update/:id")
  @ResponseMessage(CLIENT_RESPONSE_MESSAGES.CLIENT_UPDATED)
  async update(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateClientDto,
  ) {
    return await this.clientService.update(id, updateUserDto);
  }

  @Post("active-inactive")
  @ResponseMessage(CLIENT_RESPONSE_MESSAGES.CLIENT_STATUS_CHANGED)
  async changeStatus(
    @Body() changeStatusDto: { clientId: number; status: string },
  ) {
    return await this.clientService.changeStatus(
      changeStatusDto.clientId,
      changeStatusDto.status,
    );
  }

  @Delete("delete/:id")
  @ResponseMessage(CLIENT_RESPONSE_MESSAGES.CLIENT_DELETED)
  async remove(@Param("id") id: number) {
    return await this.clientService.remove(id);
  }
}
