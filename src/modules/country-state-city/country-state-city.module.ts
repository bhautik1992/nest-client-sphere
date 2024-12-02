import { Module } from "@nestjs/common";
import { CountryStateCityController } from "./country-state-city.controller";
import { CountryStateCityService } from "./country-state-city.service";

@Module({
  controllers: [CountryStateCityController],
  providers: [CountryStateCityService],
  exports: [CountryStateCityService],
})
export class CountryStateCityModule {}
