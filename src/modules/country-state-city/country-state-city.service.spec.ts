import { Test, TestingModule } from "@nestjs/testing";
import { CountryStateCityService } from "./country-state-city.service";

describe("CountryStateCityService", () => {
  let service: CountryStateCityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountryStateCityService],
    }).compile();

    service = module.get<CountryStateCityService>(CountryStateCityService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
