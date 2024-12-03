import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Clients } from "../client/entity/client.entity";
import { Projects } from "./entity/project.entity";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
  imports: [TypeOrmModule.forFeature([Projects, Clients])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
