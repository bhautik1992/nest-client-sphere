import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/common/constants/enum.constant";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { DashboardService } from "./dashboard.service";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { DASHBOARD_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { JwtPayload } from "src/common/interfaces/jwt.interface";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

@Controller("dashboard")
@ApiTags("Dashboard")
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Roles(UserRole.USER, UserRole.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("count")
  @ResponseMessage(DASHBOARD_RESPONSE_MESSAGES.DASHBOARD_COUNT_FETCHED)
  getDashboardCount() {
    return this.dashboardService.getDashboardCount();
  }

  @Get("user-profile")
  @ResponseMessage(DASHBOARD_RESPONSE_MESSAGES.DASHBOARD_USER_PROFILE_FETCHED)
  getUserProfile(@CurrentUser() user: JwtPayload) {
    return this.dashboardService.getUserProfile(user);
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

  @Get("user-list")
  @ResponseMessage(DASHBOARD_RESPONSE_MESSAGES.DASHBOARD_USER_LIST_FETCHED)
  getUserList() {
    return this.dashboardService.getUserList();
  }
}
