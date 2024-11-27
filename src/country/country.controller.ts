import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/common/constants/enum.constant";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleGuard } from "src/security/auth/guards/role.guard";
import { CountryService } from "./country.service";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { COUNTRY_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CreateCountryDto } from "./dto/create-country.dto";

@Controller("country")
@ApiTags("Country")
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Roles(UserRole.ADMIN, UserRole.USER)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post("create")
  @ResponseMessage(COUNTRY_RESPONSE_MESSAGES.COUNTRY_INSERTED)
  async createCountry(@Body() body: CreateCountryDto) {
    return await this.countryService.create(body);
  }

  @Get("list")
  @ResponseMessage(COUNTRY_RESPONSE_MESSAGES.COUNTRY_LISTED)
  async getCountries() {
    return await this.countryService.findAll();
  }
}
