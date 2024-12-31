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
import { EmployeeRole } from "src/common/constants/enum.constant";
import { INVOICE_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { ListInvoiceDto } from "./dto/list-invoice.dto";
import { InvoiceService } from "./invoice.service";
import { JwtPayload } from "src/common/interfaces/jwt.interface";
import { CurrentEmployee } from "src/common/decorators/current-employee.decorator";

@Controller("invoice")
@ApiTags("Invoice")
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Roles(
  EmployeeRole.ADMIN,
  EmployeeRole.SALES_EXECUTIVE,
  EmployeeRole.SALES_MANAGER,
)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post("create")
  @ResponseMessage(INVOICE_RESPONSE_MESSAGES.INVOICE_INSERTED)
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentEmployee() employee: JwtPayload,
  ) {
    return await this.invoiceService.create(createInvoiceDto, employee);
  }

  @Post("list")
  @ResponseMessage(INVOICE_RESPONSE_MESSAGES.INVOICE_LISTED)
  async findAll(@Body() params: ListInvoiceDto) {
    return await this.invoiceService.findAll(params);
  }

  @Get("get/:id")
  @ResponseMessage(INVOICE_RESPONSE_MESSAGES.INVOICE_FETCHED)
  async findOne(@Param("id") id: number) {
    return await this.invoiceService.findOne(id);
  }

  @Delete("delete/:id")
  @ResponseMessage(INVOICE_RESPONSE_MESSAGES.INVOICE_DELETED)
  async delete(@Param("id") id: number) {
    return await this.invoiceService.delete(id);
  }

  @Get("getByProjectId/:projectId")
  @ResponseMessage(INVOICE_RESPONSE_MESSAGES.INVOICE_LISTED)
  async getInvoicesByProjectId(@Param("projectId") projectId: number) {
    return await this.invoiceService.getInvoicesByProjectId(projectId);
  }

  @Get("generateInvoiceNumber")
  async generateInvoiceNumber() {
    return await this.invoiceService.generateInvoiceNumber();
  }
}
