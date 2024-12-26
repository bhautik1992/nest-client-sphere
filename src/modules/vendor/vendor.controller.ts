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
import { EmployeeRole } from "src/common/constants/enum.constant";
import { VENDOR_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { VendorService } from "./vendor.service";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { ListVendorDto } from "./dto/list-vendor.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";
import { CurrentEmployee } from "src/common/decorators/current-employee.decorator";
import { JwtPayload } from "src/common/interfaces/jwt.interface";

@Controller("vendor")
@ApiTags("Vendor")
@ApiBearerAuth()
@Roles(EmployeeRole.ADMIN)
@UseGuards(RoleGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post("create")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_INSERTED)
  create(
    @Body() createVendorDto: CreateVendorDto,
    @CurrentEmployee() employee: JwtPayload,
  ) {
    return this.vendorService.create(createVendorDto, employee);
  }

  @Post("list")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_LISTED)
  @HttpCode(HttpStatus.OK)
  findAll(@Body() params: ListVendorDto) {
    return this.vendorService.findAll(params);
  }

  @Get("get/:id")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_FETCHED)
  findOne(@Param("id") id: number) {
    return this.vendorService.findOne(id);
  }

  @Post("update/:id")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_UPDATED)
  update(@Param("id") id: number, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Delete("delete/:id")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_DELETED)
  remove(@Param("id") id: number) {
    return this.vendorService.remove(id);
  }
}
