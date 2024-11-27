import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/users/entity/user.entity";
import { Clients } from "src/client/entity/client.entity";
import { Projects } from "src/project/entity/project.entity";
import { Companies } from "src/company/entity/company.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Clients, Projects, Companies])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
