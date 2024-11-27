import { Module, OnModuleInit } from "@nestjs/common";
import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Country } from "./entity/country.entity";
import { Clients } from "src/client/entity/client.entity";
import { Companies } from "src/company/entity/company.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Country, Clients, Companies])],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule implements OnModuleInit {
  constructor(private readonly countryService: CountryService) {}
  async onModuleInit(): Promise<void> {
    await this.countryService.createInitialCountry();
  }
}
