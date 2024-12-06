import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Clients } from "../client/entity/client.entity";
import { Projects } from "./entity/project.entity";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { Companies } from "../company/entity/company.entity";
import { Employee } from "../employee/entity/employee.entity";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects, Clients, Companies, Employee]),
    CountryStateCityModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
