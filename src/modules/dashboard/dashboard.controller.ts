import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EmployeeRole } from "src/common/constants/enum.constant";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { DashboardService } from "./dashboard.service";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { DASHBOARD_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { JwtPayload } from "src/common/interfaces/jwt.interface";
import { CurrentEmployee } from "src/common/decorators/current-employee.decorator";

@Controller("dashboard")
@ApiTags("Dashboard")
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Roles(
  EmployeeRole.ADMIN,
  EmployeeRole.SALES_MANAGER,
  EmployeeRole.SALES_EXECUTIVE,
  EmployeeRole.PROJECT_MANAGER,
  EmployeeRole.TEAM_LEADER,
  EmployeeRole.SENIOR_SOFTWARE_ENGINEER,
  EmployeeRole.SOFTWARE_ENGINEER,
  EmployeeRole.TRAINEE,
)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("count")
  @ResponseMessage(DASHBOARD_RESPONSE_MESSAGES.DASHBOARD_COUNT_FETCHED)
  getDashboardCount() {
    return this.dashboardService.getDashboardCount();
  }

  @Get("employee-profile")
  @ResponseMessage(
    DASHBOARD_RESPONSE_MESSAGES.DASHBOARD_EMPLOYEE_PROFILE_FETCHED,
  )
  getEmployeeProfile(@CurrentEmployee() employee: JwtPayload) {
    return this.dashboardService.getEmployeeProfile(employee);
  }

  @Get("client-list")
  @ResponseMessage(DASHBOARD_RESPONSE_MESSAGES.DASHBOARD_CLIENT_LIST_FETCHED)
  getClientList() {
    return this.dashboardService.getClientList();
  }

  @Get("company-list")
  @ResponseMessage(DASHBOARD_RESPONSE_MESSAGES.DASHBOARD_COMPANY_LIST_FETCHED)
  getCompanyList() {
    return this.dashboardService.getCompanyList();
  }

  @Get("employee-list")
  @ResponseMessage(DASHBOARD_RESPONSE_MESSAGES.DASHBOARD_EMPLOYEE_LIST_FETCHED)
  getEmployeeList() {
    return this.dashboardService.getEmployeeList();
  }

  @Get("project-list")
  @ResponseMessage(DASHBOARD_RESPONSE_MESSAGES.DASHBOARD_PROJECT_LIST_FETCHED)
  getProjectList() {
    return this.dashboardService.getProjectList();
  }
}
