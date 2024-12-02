import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";
import { Projects } from "../project/entity/project.entity";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { Clients } from "./entity/client.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Clients, Projects]),
    CountryStateCityModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
