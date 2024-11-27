import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "./entity/country.entity";
import { Repository } from "typeorm";
import { CreateCountryDto } from "./dto/create-country.dto";
import { CustomError } from "src/common/helpers/exceptions";
import { CountryList } from "src/common/constants/enum.constant";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async createInitialCountry() {
    try {
      const countriesToInsert = CountryList.map((name) => ({ name }));
      const createdCountries =
        await this.countryRepository.save(countriesToInsert);
      return createdCountries;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async create(createCountryDto: CreateCountryDto) {
    try {
      const country = this.countryRepository.create(createCountryDto);
      const createdCountry = await this.countryRepository.save(country);
      return createdCountry;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findAll() {
    try {
      return await this.countryRepository.find();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}
