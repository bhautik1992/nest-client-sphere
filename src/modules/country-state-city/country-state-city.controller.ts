import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EmployeeRole } from "src/common/constants/enum.constant";
import {
  CITY_RESPONSE_MESSAGES,
  COUNTRY_RESPONSE_MESSAGES,
  STATE_RESPONSE_MESSAGES,
} from "src/common/constants/response.constant";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { CountryStateCityService } from "./country-state-city.service";
import { ListCitiesDto } from "./dto/list-cities.dto";
import { ListStateDto } from "./dto/list-state.dto";

@Controller("country-state-city")
@ApiTags("Country-State-City")
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Roles(EmployeeRole.ADMIN, EmployeeRole.EMPLOYEE)
export class CountryStateCityController {
  constructor(
    private readonly countryStateCityService: CountryStateCityService,
  ) {}

  @Get("country-list")
  @ResponseMessage(COUNTRY_RESPONSE_MESSAGES.COUNTRY_LISTED)
  async getCountries() {
    return await this.countryStateCityService.getAllCountry();
  }

  @Post("state-list")
  @ResponseMessage(STATE_RESPONSE_MESSAGES.STATE_LISTED)
  async getStates(@Body() body: ListStateDto) {
    return await this.countryStateCityService.getStateByCountry(
      body.countryCode,
    );
  }

  @Post("city-list")
  @ResponseMessage(CITY_RESPONSE_MESSAGES.CITY_LISTED)
  async getCities(@Body() body: ListCitiesDto) {
    return await this.countryStateCityService.getCitiesByState(
      body.countryCode,
      body.stateCode,
    );
  }
}
