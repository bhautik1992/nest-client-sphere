import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmployeeModel } from "../../common/test/entity.model";
import { EmployeeService } from "src/modules/employee/employee.service";
import { Employee } from "src/modules/employee/entity/employee.entity";

describe("AuthController", () => {
  let controller: AuthController,
    service: AuthService,
    employeeService: EmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        EmployeeService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(Employee),
          useClass: EmployeeModel,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(employeeService).toBeDefined();
  });
});
