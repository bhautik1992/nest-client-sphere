import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Clients } from "../client/entity/client.entity";
import { Vendors } from "../vendor/entity/vendor.entity";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";
import { Crs } from "../cr/entity/cr.entity";
import { Projects } from "../project/entity/project.entity";
import { Invoices } from "./entity/invoice.entity";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./invoice.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoices, Clients, Vendors, Projects, Crs]),
    CountryStateCityModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
