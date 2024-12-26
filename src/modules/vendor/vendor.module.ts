import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VendorController } from "./vendor.controller";
import { VendorService } from "./vendor.service";
import { Vendors } from "./entity/vendor.entity";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";
import { Clients } from "../client/entity/client.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendors, Clients]),
    CountryStateCityModule,
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule implements OnModuleInit {
  constructor(private readonly vendorService: VendorService) {}

  async onModuleInit() {
    await this.vendorService.createInitialCompany();
  }
}
