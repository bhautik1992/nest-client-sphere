import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EMPLOYEE_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError, TypeExceptions } from "src/common/helpers/exceptions";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { ListEmployeeDto } from "./dto/list-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { Employee } from "./entity/employee.entity";
const bcrypt = require("bcryptjs");

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    if (await this.getEmployeeByEmail(createEmployeeDto.companyEmail)) {
      throw TypeExceptions.EmployeeAlreadyExists();
    }
    createEmployeeDto.password = await bcrypt.hash(
      `${createEmployeeDto.firstName}@123`,
      10,
    );
    const employee = this.employeeRepository.create(createEmployeeDto);
    const createdEmployee = await this.employeeRepository.save(employee);
    delete createdEmployee.password;
    return createdEmployee;
  }

  async findAll(params: ListEmployeeDto) {
    try {
      const queryBuilder =
        this.employeeRepository.createQueryBuilder("employee");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "(employee.firstName ILIKE :search OR employee.lastName ILIKE :search OR employee.personalEmail ILIKE :search OR employee.companyEmail ILIKE :search)",
          { search: `%${params.search}%` },
        );
      }

      const totalQuery = queryBuilder.clone();

      // Apply sorting
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `employee.${params.sortBy}`,
          params.sortOrder === "asc" ? "ASC" : "DESC",
        );
      } else {
        queryBuilder.orderBy("employee.createdAt", "DESC");
      }

      // Apply pagination
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset);
        queryBuilder.take(params.limit);
      }

      queryBuilder.leftJoinAndSelect(
        "employee.reportingPerson",
        "reportingPerson",
      );

      if (params.deletedEmployee) {
        queryBuilder.withDeleted();
        queryBuilder.andWhere("employee.deletedAt IS NOT NULL");
      }

      const employees = await queryBuilder.getMany();
      const recordsTotal = await totalQuery.getCount();
      return {
        result: employees,
        recordsTotal,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(employeeId: number) {
    try {
      const employeeExits = await this.employeeRepository.findOneBy({
        id: employeeId,
      });
      if (!employeeExits) {
        throw CustomError(
          EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return this.employeeRepository
        .createQueryBuilder("employee")
        .leftJoinAndSelect("employee.reportingPerson", "reportingPerson")
        .where({ id: employeeId })
        .andWhere("employee.deletedAt IS NULL")
        .getOne();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(employeeId: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employeeExits = await this.employeeRepository.findOneBy({
        id: employeeId,
      });
      if (!employeeExits) {
        throw CustomError(
          EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedEntity = { id: employeeId, ...updateEmployeeDto };
      const updatedEmployee = await this.employeeRepository.save(updatedEntity);
      return updatedEmployee;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async remove(employeeId: number) {
    try {
      const isEmployeeExists = await this.employeeRepository.findOneBy({
        id: employeeId,
      });
      if (!isEmployeeExists) {
        throw CustomError(
          EMPLOYEE_RESPONSE_MESSAGES.EMPLOYEE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.employeeRepository.softDelete({ id: employeeId });
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getEmployeeByEmail(email: string) {
    return await this.employeeRepository.findOne({
      where: { companyEmail: email },
    });
  }
}
