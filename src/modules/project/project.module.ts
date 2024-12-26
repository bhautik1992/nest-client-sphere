import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Clients } from "../client/entity/client.entity";
import { Projects } from "./entity/project.entity";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { Vendors } from "../vendor/entity/vendor.entity";
import { Employee } from "../employee/entity/employee.entity";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";
import { Crs } from "../cr/entity/cr.entity";
import { MileStoneModule } from "../mile-stone/mile-stone.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects, Clients, Vendors, Employee, Crs]),
    CountryStateCityModule,
    MileStoneModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
