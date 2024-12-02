import { Injectable } from "@nestjs/common";
import { City, Country, State } from "country-state-city";
import { CustomError } from "src/common/helpers/exceptions";

@Injectable()
export class CountryStateCityService {
  constructor() {}

  async getAllCountry() {
    try {
      const countryList = Country.getAllCountries();
      return countryList;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getStateByCountry(countryCode: string) {
    try {
      const stateList = State.getStatesOfCountry(countryCode);
      return stateList;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getCitiesByState(countryCode: string, stateCode: string) {
    try {
      const cities = City.getCitiesOfState(countryCode, stateCode);
      return cities;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getCountryByCode(countryCode: string) {
    try {
      const country = Country.getCountryByCode(countryCode);
      return country.name;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getStateByCode(stateCode: string, countryCode: string) {
    try {
      const state = State.getStateByCodeAndCountry(stateCode, countryCode);
      return state.name;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}
