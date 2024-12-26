import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vendors } from "../vendor/entity/vendor.entity";
import { Projects } from "../project/entity/project.entity";
import { Clients } from "../client/entity/client.entity";
import { Employee } from "../employee/entity/employee.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Clients, Projects, Vendors])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
