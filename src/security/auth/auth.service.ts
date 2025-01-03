import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChangePasswordDto, LoginDto } from "../../common/dto/common.dto";
import { AuthExceptions, CustomError } from "src/common/helpers/exceptions";
import { ConfigService } from "@nestjs/config";
import { Employee } from "src/modules/employee/entity/employee.entity";
import { CreateEmployeeDto } from "src/modules/employee/dto/create-employee.dto";
const bcrypt = require("bcryptjs");

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(params: LoginDto) {
    const employee = await this.employeeRepository.findOneBy({
      companyEmail: params.email,
    });

    if (!employee) {
      throw AuthExceptions.AccountNotExist();
    }
    if (!(await bcrypt.compareSync(params.password, employee.password))) {
      throw AuthExceptions.InvalidIdPassword();
    }
    delete employee.password;
    const payload = {
      id: employee.id,
      name: employee.firstName,
      role: employee.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_TOKEN_SECRET,
        expiresIn: process.env.JWT_TONE_EXPIRY_TIME,
      }),
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      personalEmail: employee.personalEmail,
      companyEmail: employee.companyEmail,
      role: employee.role,
    };
  }

  async changePassword(body: ChangePasswordDto) {
    try {
      const employee = await this.employeeRepository.findOneBy({ id: body.id });
      if (!employee) {
        throw AuthExceptions.AccountNotExist();
      }
      const isPasswordMatch = await bcrypt.compareSync(
        body.currentPassword,
        employee.password,
      );
      if (!isPasswordMatch) {
        throw AuthExceptions.InvalidIdPassword();
      }
      employee.password = await bcrypt.hash(body.newPassword, 10);
      await this.employeeRepository.save(employee);
      return {};
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async createInitialEmployee(): Promise<void> {
    const employee = await this.employeeRepository.findOne({
      where: [
        {
          companyEmail: this.configService.get(
            "database.initialEmployee.companyEmail",
          ),
        },
      ],
    });

    if (employee) {
      console.log("Initial employee already loaded.");
    } else {
      const params: CreateEmployeeDto = {
        firstName: this.configService.get("database.initialEmployee.firstName"),
        middleName: this.configService.get(
          "database.initialEmployee.middleName",
        ),
        lastName: this.configService.get("database.initialEmployee.lastName"),
        role: this.configService.get("database.initialEmployee.role"),
        personalEmail: this.configService.get(
          "database.initialEmployee.personalEmail",
        ),
        companyEmail: this.configService.get(
          "database.initialEmployee.companyEmail",
        ),
        phone: this.configService.get("database.initialEmployee.phone"),
        department: this.configService.get(
          "database.initialEmployee.department",
        ),
        dateOfBirth: this.configService.get(
          "database.initialEmployee.dateOfBirth",
        ),
        joiningDate: this.configService.get(
          "database.initialEmployee.joiningDate",
        ),
        reportingPersonId: 0,
        PAN: this.configService.get("database.initialEmployee.PAN"),
        aadhar: this.configService.get("database.initialEmployee.aadhar"),
        address: this.configService.get("database.initialEmployee.address"),
        bankName: this.configService.get("database.initialEmployee.bankName"),
        accountNumber: this.configService.get(
          "database.initialEmployee.accountNumber",
        ),
        IFSC: this.configService.get("database.initialEmployee.IFSC"),
        status: this.configService.get("database.initialEmployee.status"),
        emergencyContactName: this.configService.get(
          "database.initialEmployee.emergencyContactName",
        ),
        emergencyContactNumber: this.configService.get(
          "database.initialEmployee.emergencyContactNumber",
        ),
        password: "",
        imageUrl: "",
      };
      params.password = await bcrypt.hash(
        this.configService.get("database.initialEmployee.password"),
        10,
      );
      const employee = this.employeeRepository.create(params);
      await this.employeeRepository.save(employee);
      console.log("Initial employee loaded successfully.");
    }
  }
}
