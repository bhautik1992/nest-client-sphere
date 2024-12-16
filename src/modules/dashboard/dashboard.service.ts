import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EMPLOYEE_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";
import { JwtPayload } from "src/common/interfaces/jwt.interface";
import { Repository } from "typeorm";
import { Employee } from "../employee/entity/employee.entity";
import { Clients } from "../client/entity/client.entity";
import { Projects } from "../project/entity/project.entity";
import { Companies } from "../company/entity/company.entity";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Clients)
    private readonly clientRepository: Repository<Clients>,
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
    @InjectRepository(Companies)
    private readonly companyRepository: Repository<Companies>,
  ) {}

  async getDashboardCount() {
    const [employeesCount, clientsCount, projectsCount, companiesCount] =
      await Promise.all([
        this.employeeRepository.count(),
        this.clientRepository.count(),
        this.projectRepository.count(),
        this.companyRepository.count(),
      ]);

    return { employeesCount, clientsCount, projectsCount, companiesCount };
  }

  async getEmployeeProfile(employee: JwtPayload) {
    try {
      const loggedEmployee = await this.employeeRepository.findOneBy({
        id: employee.id,
      });
      if (!loggedEmployee) {
        throw CustomError(
          EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return loggedEmployee;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getClientList() {
    try {
      const queryBuilder = this.clientRepository
        .createQueryBuilder("client")
        .leftJoinAndSelect("client.company", "company");
      return await queryBuilder
        .select([
          "client.id",
          "client.firstName",
          "client.lastName",
          "client.clientCompanyName",
          "company.name as companyName",
        ])
        .getMany();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getCompanyList() {
    try {
      const queryBuilder = this.companyRepository.createQueryBuilder("company");
      return await queryBuilder
        .select(["company.id", "company.name", "company.email"])
        .getMany();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getEmployeeList() {
    try {
      const queryBuilder =
        this.employeeRepository.createQueryBuilder("employee");
      return await queryBuilder
        .select([
          "employee.id",
          "employee.firstName",
          "employee.lastName",
          "employee.personalEmail",
          "employee.companyEmail",
          "employee.role",
        ])
        .getMany();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getProjectList() {
    try {
      const queryBuilder = this.projectRepository
        .createQueryBuilder("project")
        .leftJoin("project.client", "client");

      return await queryBuilder
        .select([
          "project.id",
          "project.name",
          "project.status",
          "project.billingType",
          "project.currency",
          "client.id",
          "client.clientCompanyName",
        ])
        .getMany();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}
