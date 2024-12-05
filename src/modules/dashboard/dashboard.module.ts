import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Companies } from "../company/entity/company.entity";
import { Projects } from "../project/entity/project.entity";
import { Clients } from "../client/entity/client.entity";
import { Employee } from "../employee/entity/employee.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Clients, Projects, Companies])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
