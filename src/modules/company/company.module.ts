import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { Companies } from "./entity/company.entity";
import { CountryStateCityModule } from "../country-state-city/country-state-city.module";
import { Clients } from "../client/entity/client.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Companies, Clients]),
    CountryStateCityModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule implements OnModuleInit {
  constructor(private readonly companyService: CompanyService) {}

  async onModuleInit() {
    await this.companyService.createInitialCompany();
  }
}
