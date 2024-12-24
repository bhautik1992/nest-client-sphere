import { Test, TestingModule } from "@nestjs/testing";
import { MileStoneService } from "./mile-stone.service";

describe("MileStoneService", () => {
  let service: MileStoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MileStoneService],
    }).compile();

    service = module.get<MileStoneService>(MileStoneService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
