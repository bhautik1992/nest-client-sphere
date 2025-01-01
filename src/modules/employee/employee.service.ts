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
import ExcelJS from "exceljs";
import { Response } from "express";
import { EmployeeStatus } from "src/common/constants/enum.constant";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    if (
      await this.getEmployeeByEmail(
        createEmployeeDto.companyEmail,
        createEmployeeDto.personalEmail,
      )
    ) {
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

      if (params.employeeCode)
        queryBuilder.andWhere("employee.employeeCode = :employeeCode", {
          employeeCode: params.employeeCode,
        });
      if (params.name)
        queryBuilder.andWhere("employee.name ILIKE :name", {
          name: params.name,
        });
      if (params.email)
        queryBuilder.andWhere(
          "employee.personalEmail ILIKE :email OR employee.companyEmail ILIKE :email",
          { email: params.email },
        );
      if (params.role)
        queryBuilder.andWhere("employee.role = :role", { role: params.role });

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

  async getEmployeeByEmail(companyEmail: string, personalEmail: string) {
    return await this.employeeRepository.findOne({
      where: [{ companyEmail }, { personalEmail }],
    });
  }

  async changeEmployeeStatus(employeeId: number, status: EmployeeStatus) {
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
      employeeExits.status = status;
      const updatedEmployee = await this.employeeRepository.save(employeeExits);
      return updatedEmployee;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async exportEmployees(params: ListEmployeeDto, response: Response) {
    try {
      const queryBuilder =
        this.employeeRepository.createQueryBuilder("employee");

      if (params.search) {
        queryBuilder.where(
          "(employee.firstName ILIKE :search OR employee.lastName ILIKE :search OR employee.personalEmail ILIKE :search OR employee.companyEmail ILIKE :search)",
          { search: `%${params.search}%` },
        );
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

      // Generate Excel
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Employees");

      // Add Headers
      const headers = [
        "First Name",
        "Middle Name",
        "Last Name",
        "Personal Email",
        "Company Email",
        "Reporting Person",
        "Role",
        "Status",
        "phone",
        "Date of Birth",
        "Joining Date",
        "Address",
        "Department",
        "PAN Number",
        "Aadhar Number",
        "Bank Name",
        "Bank Account Number",
        "IFSC Code",
        "Emergency Contact Name",
        "Emergency Contact Number",
      ];
      sheet.addRow(headers);

      // Add Data Rows
      employees.forEach((employee) => {
        const joiningDate = employee.joiningDate
          ? new Date(employee.joiningDate)
          : null;
        const dateOfBirth = employee.dateOfBirth
          ? new Date(employee.dateOfBirth)
          : null;
        sheet.addRow([
          employee.firstName,
          employee.middleName,
          employee.lastName,
          employee.personalEmail,
          employee.companyEmail,
          employee.reportingPerson
            ? employee.reportingPerson.firstName +
              " " +
              employee.reportingPerson.lastName
            : "",
          employee.role,
          employee.status,
          employee.phone,
          dateOfBirth,
          joiningDate,
          employee.address,
          employee.department,
          employee.PAN,
          employee.aadhar,
          employee.bankName,
          employee.accountNumber,
          employee.IFSC,
          employee.emergencyContactName,
          employee.emergencyContactNumber,
        ]);
        if (joiningDate) {
          const cell = sheet.getCell(`K${sheet.rowCount}`);
          cell.value = joiningDate;
          cell.numFmt = "yyyy-mm-dd";
        }
        if (dateOfBirth) {
          const dateOfBirthCell = sheet.getCell(`J${sheet.rowCount}`);
          dateOfBirthCell.value = dateOfBirth;
          dateOfBirthCell.numFmt = "yyyy-mm-dd";
        }
      });

      // Write Excel to Buffer
      const buffer = await workbook.xlsx.writeBuffer();
      response.setHeader(
        "Content-Disposition",
        `attachment; filename="Employees_${Date.now()}.xlsx"`,
      );
      response.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      // Send File as Response
      response.send(buffer);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
