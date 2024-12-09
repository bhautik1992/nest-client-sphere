import { Test, TestingModule } from "@nestjs/testing";
import { CrController } from "./cr.controller";

describe("CrController", () => {
  let controller: CrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrController],
    }).compile();

    controller = module.get<CrController>(CrController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
