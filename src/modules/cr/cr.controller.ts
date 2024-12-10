import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CrStatus, EmployeeRole } from "src/common/constants/enum.constant";
import { CR_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { Roles } from "src/common/decorators/role.decorator";
import { CrService } from "./cr.service";
import { CreateCrDto } from "./dto/create-cr.dto";
import { ListCrDto } from "./dto/list-cr.dto";
import { Response } from "express";

@Controller("cr")
@ApiTags("CR")
@ApiBearerAuth()
@UseGuards()
@Roles(EmployeeRole.ADMIN)
export class CrController {
  constructor(private readonly crService: CrService) {}

  @Post("create")
  @ResponseMessage(CR_RESPONSE_MESSAGES.CR_INSERTED)
  async create(@Body() createCrDto: CreateCrDto) {
    return await this.crService.create(createCrDto);
  }

  @Post("list")
  @ResponseMessage(CR_RESPONSE_MESSAGES.CR_LISTED)
  async findAll(@Body() listDto: ListCrDto) {
    return await this.crService.findAll(listDto);
  }

  @Post("update/:id")
  @ResponseMessage(CR_RESPONSE_MESSAGES.CR_UPDATED)
  async update(@Param("id") id: number, @Body() updateCrDto: CreateCrDto) {
    return await this.crService.update(id, updateCrDto);
  }

  @Get("get/:id")
  @ResponseMessage(CR_RESPONSE_MESSAGES.CR_FETCHED)
  async findOne(@Param("id") id: number) {
    return await this.crService.findOne(id);
  }

  @Delete("delete/:id")
  @ResponseMessage(CR_RESPONSE_MESSAGES.CR_DELETED)
  async remove(@Param("id") id: number) {
    return await this.crService.remove(id);
  }

  @Post("status")
  @ResponseMessage(CR_RESPONSE_MESSAGES.CR_STATUS_CHANGED)
  async changeCrStatus(
    @Body() changeCrStatusDto: { crId: number; status: CrStatus },
  ) {
    return await this.crService.changeCrStatus(
      changeCrStatusDto.crId,
      changeCrStatusDto.status,
    );
  }

  @Get("getByProjectId/:projectId")
  @ResponseMessage(CR_RESPONSE_MESSAGES.CR_FETCHED)
  async getCrByProjectId(@Param("projectId") projectId: number) {
    return await this.crService.getCrByProjectId(projectId);
  }

  @Post("export")
  @ResponseMessage(CR_RESPONSE_MESSAGES.CR_EXPORTED)
  async export(@Body() params: ListCrDto, @Res() res: Response) {
    return await this.crService.exportCrs(params, res);
  }
}
