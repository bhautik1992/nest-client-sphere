import { HttpStatus, Injectable, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CrStatus } from "src/common/constants/enum.constant";
import { CR_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";
import { Repository } from "typeorm";
import { Companies } from "../company/entity/company.entity";
import { CountryStateCityService } from "../country-state-city/country-state-city.service";
import { CreateCrDto } from "./dto/create-cr.dto";
import { ListCrDto } from "./dto/list-cr.dto";
import { UpdateCrDto } from "./dto/update-cr.dto";
import { Crs } from "./entity/cr.entity";
import ExcelJS from "exceljs";
import { Response } from "express";

interface ExtendedCompany extends Companies {
  countryName?: string;
  stateName?: string;
}

@Injectable()
export class CrService {
  constructor(
    @InjectRepository(Crs)
    private readonly crRepository: Repository<Crs>,
    private readonly countryStateCityService: CountryStateCityService,
  ) {}

  async create(createCrDto: CreateCrDto) {
    try {
      const isCrExist = await this.crRepository.findOneBy({
        name: createCrDto.name,
      });
      if (isCrExist) {
        throw CustomError(
          CR_RESPONSE_MESSAGES.CR_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      const cr = this.crRepository.create(createCrDto);
      return await this.crRepository.save(cr);
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findAll(params: ListCrDto) {
    try {
      const queryBuilder = this.crRepository.createQueryBuilder("cr");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "cr.name ILIKE :search OR cr.description ILIKE :search OR cr.status ILIKE :search",
          {
            search: `%${params.search}%`,
          },
        );
      }

      if (params.isInternalCr) {
        queryBuilder.andWhere("cr.isInternalCr = :isInternalCr", {
          isInternalCr: params.isInternalCr,
        });
      }

      const totalQuery = queryBuilder.clone();

      // Apply sorting if sort and sortBy are provided
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `cr.${params.sortBy}`,
          params.sortOrder === "asc" ? "ASC" : "DESC",
        );
      } else {
        queryBuilder.orderBy("cr.createdAt", "DESC");
      }

      // Apply pagination if page and limit are provided
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset).take(params.limit);
      }

      queryBuilder
        .leftJoinAndSelect("cr.client", "client")
        .leftJoinAndSelect("client.company", "company")
        .leftJoinAndSelect("cr.project", "project")
        .leftJoinAndSelect("cr.assignFromCompany", "assignFromCompany");

      const crs = await queryBuilder.getMany();

      const crList = await Promise.all(
        crs.map(async (cr) => {
          const assignFromCompanyCountryName =
            await this.countryStateCityService.getCountryByCode(
              cr.assignFromCompany.countryCode,
            );
          let assignFromCompanyStateName = null;
          if (cr.assignFromCompany.stateCode) {
            assignFromCompanyStateName =
              await this.countryStateCityService.getStateByCode(
                cr.assignFromCompany.stateCode,
                cr.assignFromCompany.countryCode,
              );
          }
          const extendedAssignFromCompany: ExtendedCompany = {
            ...cr.assignFromCompany,
            countryName: assignFromCompanyCountryName,
            stateName: assignFromCompanyStateName,
          };
          return {
            ...cr,
            assignFromCompany: extendedAssignFromCompany,
          };
        }),
      );

      const recordsTotal = await totalQuery.getCount();

      return {
        result: crList,
        recordsTotal,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(id: number) {
    try {
      const cr = await this.crRepository.findOneBy({ id });
      if (!cr) {
        throw CustomError(
          CR_RESPONSE_MESSAGES.CR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const queryBuilder = this.crRepository
        .createQueryBuilder("cr")
        .leftJoinAndSelect("cr.client", "client")
        .leftJoinAndSelect("client.company", "company")
        .leftJoinAndSelect("cr.project", "project")
        .leftJoinAndSelect("cr.assignFromCompany", "assignFromCompany")
        .where("cr.id = :id", { id });

      const crData = await queryBuilder.getOne();

      const assignFromCompanyCountryName =
        await this.countryStateCityService.getCountryByCode(
          crData.assignFromCompany.countryCode,
        );
      let assignFromCompanyStateName = null;
      if (crData.assignFromCompany.stateCode) {
        assignFromCompanyStateName =
          await this.countryStateCityService.getStateByCode(
            crData.assignFromCompany.stateCode,
            crData.assignFromCompany.countryCode,
          );
      }
      const extendedAssignFromCompany: ExtendedCompany = {
        ...crData.assignFromCompany,
        countryName: assignFromCompanyCountryName,
        stateName: assignFromCompanyStateName,
      };
      return {
        ...crData,
        assignFromCompany: extendedAssignFromCompany,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(id: number, updateCrDto: UpdateCrDto) {
    try {
      const cr = await this.crRepository.findOneBy({ id });
      if (!cr) {
        throw CustomError(
          CR_RESPONSE_MESSAGES.CR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const updatedData: any = { ...cr, ...updateCrDto };
      const updatedCr = await this.crRepository.save(updatedData);
      return updatedCr;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async remove(id: number) {
    try {
      const cr = await this.crRepository.findOneBy({ id });
      if (!cr) {
        throw CustomError(
          CR_RESPONSE_MESSAGES.CR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.crRepository.remove(cr);
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async changeCrStatus(id: number, status: CrStatus) {
    try {
      const cr = await this.crRepository.findOneBy({ id });
      if (!cr) {
        throw CustomError(
          CR_RESPONSE_MESSAGES.CR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      cr.status = status;
      const updatedCr = await this.crRepository.save(cr);
      return updatedCr;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getCrByProjectId(projectId: number) {
    try {
      const cr = await this.crRepository.findOneBy({ projectId });
      if (!cr) {
        throw CustomError(
          CR_RESPONSE_MESSAGES.CR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const queryBuilder = this.crRepository
        .createQueryBuilder("cr")
        .leftJoinAndSelect("client", "client")
        .leftJoinAndSelect("client.company", "company")
        .leftJoinAndSelect("project", "project")
        .leftJoinAndSelect("assignFromCompany", "assignFromCompany")
        .where("cr.projectId = :projectId", { projectId });

      const crData = await queryBuilder.getOne();

      return crData;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async exportCrs(params: ListCrDto, @Res() response: Response) {
    try {
      const queryBuilder = this.crRepository.createQueryBuilder("cr");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "cr.name ILIKE :search OR cr.description ILIKE :search OR cr.status ILIKE :search",
          {
            search: `%${params.search}%`,
          },
        );
      }

      if (params.isInternalCr) {
        queryBuilder.andWhere("cr.isInternalCr = :isInternalCr", {
          isInternalCr: params.isInternalCr,
        });
      }

      queryBuilder
        .leftJoinAndSelect("cr.client", "client")
        .leftJoinAndSelect("client.company", "company")
        .leftJoinAndSelect("cr.project", "project")
        .leftJoinAndSelect("cr.assignFromCompany", "assignFromCompany");

      const crs = await queryBuilder.getMany();

      const crList = await Promise.all(
        crs.map(async (cr) => {
          const assignFromCompanyCountryName =
            await this.countryStateCityService.getCountryByCode(
              cr.assignFromCompany.countryCode,
            );
          let assignFromCompanyStateName = null;
          if (cr.assignFromCompany.stateCode) {
            assignFromCompanyStateName =
              await this.countryStateCityService.getStateByCode(
                cr.assignFromCompany.stateCode,
                cr.assignFromCompany.countryCode,
              );
          }
          const extendedAssignFromCompany: ExtendedCompany = {
            ...cr.assignFromCompany,
            countryName: assignFromCompanyCountryName,
            stateName: assignFromCompanyStateName,
          };
          return {
            ...cr,
            assignFromCompany: extendedAssignFromCompany,
          };
        }),
      );

      // Generate Excel
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Projects");

      // Add Headers
      const headers = [
        "Name",
        "Description",
        "Start Date",
        "End Date",
        "Status",
        "Project",
        "Client Name",
        "Assign To Company",
        "Billing type",
        "Hourly rate",
        "Cr hours",
        "Total hours",
        "Currency",
      ];

      sheet.addRow(headers);
      crList.forEach((cr) => {
        sheet.addRow([
          cr.name,
          cr.description,
          cr.startDate,
          cr.endDate,
          cr.status,
          cr.project.name,
          cr.client.company.name,
          cr.assignFromCompany.name,
          cr.billingType,
          cr.hourlyMonthlyRate,
          cr.crHours,
          cr.crCost,
          cr.currency,
        ]);
      });

      // Write Excel to Buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Set Response Headers for Download
      response.setHeader(
        "Content-Disposition",
        `attachment; filename="CR_${Date.now()}.xlsx"`,
      );
      response.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      // Send File as Response
      response.send(buffer);
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}
