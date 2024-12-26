import { Module } from "@nestjs/common";
import { CrController } from "./cr.controller";
import { CrService } from "./cr.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Crs } from "./entity/cr.entity";
import { Projects } from "../project/entity/project.entity";
import { Clients } from "../client/entity/client.entity";
import { Vendors } from "../vendor/entity/vendor.entity";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Crs, Projects, Clients, Vendors]),
    CountryStateCityModule,
  ],
  controllers: [CrController],
  providers: [CrService],
})
export class CrModule {}
