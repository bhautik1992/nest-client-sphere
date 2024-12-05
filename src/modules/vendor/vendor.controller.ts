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
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { VendorService } from "./vendor.service";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { VENDOR_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { ListDto } from "src/common/dto/common.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";

@Controller("vendor")
@ApiTags("Vendor")
@ApiBearerAuth()
@Roles(EmployeeRole.ADMIN)
@UseGuards(RoleGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post("create")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_INSERTED)
  async create(@Body() createVendorDto: CreateVendorDto) {
    return await this.vendorService.create(createVendorDto);
  }

  @Post("list")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_LISTED)
  async findAll(@Body() listDto: ListDto) {
    return await this.vendorService.findAll(listDto);
  }

  @Get("get/:id")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_FETCHED)
  async findOne(@Param("id") id: number) {
    return await this.vendorService.findOne(id);
  }

  @Post("update/:id")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_UPDATED)
  async update(
    @Param("id") id: number,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return await this.vendorService.update(id, updateVendorDto);
  }

  @Delete("delete/:id")
  @ResponseMessage(VENDOR_RESPONSE_MESSAGES.VENDOR_DELETED)
  async remove(@Param("id") id: number) {
    return await this.vendorService.remove(id);
  }
}
