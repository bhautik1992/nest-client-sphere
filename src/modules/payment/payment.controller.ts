import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EmployeeRole } from "src/common/constants/enum.constant";
import { PAYMENT_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ListPaymentDto } from "./dto/list-payment.dto";
import { PaymentService } from "./payment.service";

@Controller("payment")
@ApiTags("Payment")
@UseGuards(RoleGuard)
@Roles(EmployeeRole.ADMIN)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get("generatePaymentNumber")
  async generatePaymentNumber() {
    return await this.paymentService.generatePaymentNumber();
  }

  @Post("create")
  @ResponseMessage(PAYMENT_RESPONSE_MESSAGES.PAYMENT_INSERTED)
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.create(createPaymentDto);
  }

  @Post("list")
  @ResponseMessage(PAYMENT_RESPONSE_MESSAGES.PAYMENT_LISTED)
  async findAll(@Body() listDto: ListPaymentDto) {
    return await this.paymentService.findAll(listDto);
  }

  @Get("get/:id")
  @ResponseMessage(PAYMENT_RESPONSE_MESSAGES.PAYMENT_FETCHED)
  async findOne(@Param("id") id: number) {
    return await this.paymentService.findOne(id);
  }

  @Delete("delete/:id")
  @ResponseMessage(PAYMENT_RESPONSE_MESSAGES.PAYMENT_DELETED)
  async delete(@Param("id") id: number) {
    return await this.paymentService.delete(id);
  }
}
