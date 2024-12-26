import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  EmployeeRole,
  EmployeeStatus,
} from "src/common/constants/enum.constant";
import { EMPLOYEE_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { ListEmployeeDto } from "./dto/list-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeService } from "./employee.service";
import { Response } from "express";

@Controller("employee")
@ApiTags("Employee")
@ApiBearerAuth()
@Roles(
  EmployeeRole.ADMIN,
  EmployeeRole.SALES_EXECUTIVE,
  EmployeeRole.SALES_MANAGER,
  EmployeeRole.PROJECT_MANAGER,
)
@UseGuards(RoleGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post("create")
  @ResponseMessage(EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_INSERTED)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post("list")
  @ResponseMessage(EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_LISTED)
  @HttpCode(HttpStatus.OK)
  async findAll(@Body() params: ListEmployeeDto) {
    return await this.employeeService.findAll(params);
  }

  @Get("get/:id")
  @ResponseMessage(EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_FETCHED)
  findOne(@Param("id") id: number) {
    return this.employeeService.findOne(id);
  }

  @Post("update/:id")
  @ResponseMessage(EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_UPDATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param("id") id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete("delete/:id")
  @ResponseMessage(EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_DELETED)
  remove(@Param("id") id: number) {
    return this.employeeService.remove(id);
  }

  @Post("export")
  @ResponseMessage(EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_EXPORTED)
  async export(@Body() params: ListEmployeeDto, @Res() res: Response) {
    return await this.employeeService.exportEmployees(params, res);
  }

  @Post("status")
  @ResponseMessage(EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_STATUS_CHANGED)
  async changeStatus(
    @Body() changeStatusDto: { id: number; status: EmployeeStatus },
  ) {
    return await this.employeeService.changeEmployeeStatus(
      changeStatusDto.id,
      changeStatusDto.status,
    );
  }
}
