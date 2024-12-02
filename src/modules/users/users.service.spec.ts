import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserModel } from "../common/test/entity.model";
import { Users } from "./entity/user.entity";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService, userModel: UserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        {
          provide: getRepositoryToken(Users),
          useClass: UserModel,
        },
      ],
    }).compile();

    (service = module.get<UsersService>(UsersService)),
      (userModel = module.get<UserModel>(getRepositoryToken(Users)));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(userModel).toBeDefined();
  });
});
