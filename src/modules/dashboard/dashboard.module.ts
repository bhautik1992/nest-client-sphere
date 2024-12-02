import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Companies } from "../company/entity/company.entity";
import { Projects } from "../project/entity/project.entity";
import { Clients } from "../client/entity/client.entity";
import { Users } from "../users/entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Clients, Projects, Companies])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
