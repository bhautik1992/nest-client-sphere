import { Test, TestingModule } from "@nestjs/testing";
import { MileStoneController } from "./mile-stone.controller";

describe("MileStoneController", () => {
  let controller: MileStoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MileStoneController],
    }).compile();

    controller = module.get<MileStoneController>(MileStoneController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
