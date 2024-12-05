import { Module } from "@nestjs/common";
import { VendorController } from "./vendor.controller";
import { VendorService } from "./vendor.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vendor } from "./entity/vendor.entity";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";
import { Companies } from "../company/entity/company.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, Companies]),
    CountryStateCityModule,
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
