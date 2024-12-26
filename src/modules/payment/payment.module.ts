import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payments } from "./entity/payment.entity";
import { Vendors } from "../vendor/entity/vendor.entity";
import { Clients } from "../client/entity/client.entity";
import { Projects } from "../project/entity/project.entity";
import { Invoices } from "../invoice/entity/invoice.entity";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payments, Vendors, Clients, Projects, Invoices]),
    CountryStateCityModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
