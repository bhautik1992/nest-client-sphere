import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";
import { Projects } from "../project/entity/project.entity";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { Clients } from "./entity/client.entity";
import { Companies } from "../company/entity/company.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Clients, Projects, Companies]),
    CountryStateCityModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
