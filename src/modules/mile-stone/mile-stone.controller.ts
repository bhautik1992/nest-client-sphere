import { Controller, Delete, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EmployeeRole } from "src/common/constants/enum.constant";
import { Roles } from "src/common/decorators/role.decorator";
import { MileStoneService } from "./mile-stone.service";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { MILESTONE_RESPONSE_MESSAGES } from "src/common/constants/response.constant";

@Controller("milestone")
@ApiTags("Milestone")
@Roles(
  EmployeeRole.ADMIN,
  EmployeeRole.PROJECT_MANAGER,
  EmployeeRole.SALES_EXECUTIVE,
  EmployeeRole.SALES_MANAGER,
)
export class MileStoneController {
  constructor(private readonly mileStoneService: MileStoneService) {}

  @Delete("delete/:id")
  @ResponseMessage(MILESTONE_RESPONSE_MESSAGES.MILESTONE_DELETED)
  async delete(@Param("id") id: number) {
    return await this.mileStoneService.delete(id);
  }
}
