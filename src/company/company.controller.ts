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
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/common/constants/enum.constant";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { CompanyService } from "./company.service";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { COMPANY_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { ListDto } from "src/common/dto/common.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller("Company")
@ApiTags("Company")
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.USER)
@UseGuards(RoleGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("create")
  @ResponseMessage(COMPANY_RESPONSE_MESSAGES.COMPANY_INSERTED)
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Post("list")
  @ResponseMessage(COMPANY_RESPONSE_MESSAGES.COMPANY_LISTED)
  @HttpCode(HttpStatus.OK)
  findAll(@Body() params: ListDto) {
    return this.companyService.findAll(params);
  }

  @Get("get/:id")
  @ResponseMessage(COMPANY_RESPONSE_MESSAGES.COMPANY_FETCHED)
  findOne(@Param("id") id: number) {
    return this.companyService.findOne(id);
  }

  @Post("update/:id")
  @ResponseMessage(COMPANY_RESPONSE_MESSAGES.COMPANY_UPDATED)
  update(@Param("id") id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete("remove/:id")
  @ResponseMessage(COMPANY_RESPONSE_MESSAGES.COMPANY_DELETED)
  remove(@Param("id") id: number) {
    return this.companyService.remove(id);
  }
}
