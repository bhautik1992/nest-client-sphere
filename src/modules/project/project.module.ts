import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Projects } from "./entity/project.entity";
import { Clients } from "../client/entity/client.entity";
import { Companies } from "../company/entity/company.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Projects, Clients, Companies])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
