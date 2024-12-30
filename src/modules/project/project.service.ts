import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PROJECT_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";

import ExcelJS from "exceljs";
import { Response } from "express";
import { BillingType, ProjectStatus } from "src/common/constants/enum.constant";
import {
  ExtendedCompany,
  JwtPayload,
} from "src/common/interfaces/jwt.interface";
import { Like, Repository } from "typeorm";
import { CountryStateCityService } from "../country-state-city/country-state-city.service";
import { MileStoneService } from "../mile-stone/mile-stone.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ListProjectDto } from "./dto/list-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Projects } from "./entity/project.entity";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
    private readonly countryStateCityService: CountryStateCityService,
    private readonly mileStoneService: MileStoneService,
  ) {}

  async create(createProjectDto: CreateProjectDto, currentUser: JwtPayload) {
    try {
      const isProjectExists = await this.getProjectByName(
        createProjectDto.name,
      );
      if (isProjectExists.length > 0) {
        throw CustomError(
          PROJECT_RESPONSE_MESSAGES.PROJECT_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      createProjectDto.createdBy = currentUser.id;
      createProjectDto.updatedBy = currentUser.id;
      const project = this.projectRepository.create(createProjectDto);
      const createdProject = await this.projectRepository.save(project);

      let mileStones = [];
      if (
        createdProject.billingType === BillingType.FIXED &&
        createProjectDto.milestones.length > 0
      ) {
        const promises = createProjectDto.milestones.map(async (milestone) => {
          milestone.projectId = createdProject.id;
          return this.mileStoneService.create(milestone);
        });
        mileStones = await Promise.all(promises);
      }

      return { ...createdProject, ...mileStones };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  applyFilter(queryBuilder, fieldName, filterValue, operator = "=") {
    if (filterValue !== undefined && filterValue !== null) {
      const formattedValue =
        operator === "ILIKE" ? `%${filterValue}%` : filterValue;
      queryBuilder.andWhere(`${fieldName} ${operator} :filterValue`, {
        filterValue: formattedValue,
      });
    }
  }

  async findAll(params: ListProjectDto) {
    try {
      const queryBuilder = this.projectRepository.createQueryBuilder("project");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.andWhere(
          "project.name ILIKE :search OR project.description ILIKE :search",
          {
            search: `%${params.search}%`,
          },
        );
      }

      this.applyFilter(queryBuilder, "project.status", params.status);
      this.applyFilter(
        queryBuilder,
        "project.projectManagerId",
        params.projectManagerId,
      );
      this.applyFilter(queryBuilder, "project.clientId", params.clientId);
      this.applyFilter(queryBuilder, "project.startDate", params.startDate);
      this.applyFilter(queryBuilder, "project.name", params.name);

      const totalQuery = queryBuilder.clone();

      // Apply sorting if sort and sortBy are provided
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `project.${params.sortBy}`,
          params.sortOrder === "asc" ? "ASC" : "DESC",
        );
      } else {
        queryBuilder.orderBy("project.createdAt", "DESC");
      }

      // Apply pagination if page and limit are provided
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset).take(params.limit);
      }

      queryBuilder
        .leftJoinAndSelect("project.client", "client")
        .leftJoinAndSelect("client.company", "company")
        .leftJoinAndSelect("project.assignToCompany", "assignToCompany")
        .leftJoinAndSelect("project.assignFromCompany", "assignFromCompany")
        .leftJoinAndSelect("project.projectManager", "projectManager")
        .leftJoinAndSelect("project.teamLeader", "teamLeader")
        .leftJoinAndSelect("project.milestones", "milestones")
        .leftJoinAndSelect("project.crs", "crs")
        .leftJoinAndSelect("project.developers", "developers");

      if (params.isInternalProject) {
        queryBuilder.andWhere(
          "project.isInternalProject = :isInternalProject",
          {
            isInternalProject: params.isInternalProject,
          },
        );
      }

      if (params.deletedProject) {
        queryBuilder.withDeleted();
        queryBuilder.andWhere("project.deletedAt IS NOT NULL");
      }

      const projects = await queryBuilder.getMany();

      const projectList = await Promise.all(
        projects.map(async (project) => {
          const assignFromCompanyCountryName =
            await this.countryStateCityService.getCountryByCode(
              project.assignFromCompany.countryCode,
            );
          const assignToCompanyCountryName =
            await this.countryStateCityService.getCountryByCode(
              project.assignToCompany.countryCode,
            );
          let assignFromCompanyStateName = null;
          let assignToCompanyStateName = null;
          if (project.assignFromCompany.stateCode) {
            assignFromCompanyStateName =
              await this.countryStateCityService.getStateByCode(
                project.assignFromCompany.stateCode,
                project.assignFromCompany.countryCode,
              );
          }
          if (project.assignToCompany.stateCode) {
            assignToCompanyStateName =
              await this.countryStateCityService.getStateByCode(
                project.assignToCompany.stateCode,
                project.assignToCompany.countryCode,
              );
          }
          const extendedAssignFromCompany: ExtendedCompany = {
            ...project.assignFromCompany,
            countryName: assignFromCompanyCountryName,
            stateName: assignFromCompanyStateName,
          };

          const extendedAssignToCompany: ExtendedCompany = {
            ...project.assignToCompany,
            countryName: assignToCompanyCountryName,
            stateName: assignToCompanyStateName,
          };
          return {
            ...project,
            assignFromCompany: extendedAssignFromCompany,
            assignToCompany: extendedAssignToCompany,
          };
        }),
      );

      const recordsTotal = await totalQuery.getCount();

      return {
        result: projectList,
        recordsTotal,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(id: number) {
    try {
      const project = await this.projectRepository.findOneBy({ id });
      if (!project) {
        throw CustomError(
          PROJECT_RESPONSE_MESSAGES.PROJECT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const projectData = await (await this.getProjectWithJoins(id)).getOne();
      const assignFromCompanyCountryName =
        await this.countryStateCityService.getCountryByCode(
          projectData.assignFromCompany.countryCode,
        );
      const assignToCompanyCountryName =
        await this.countryStateCityService.getCountryByCode(
          projectData.assignToCompany.countryCode,
        );
      let assignFromCompanyStateName = null;
      let assignToCompanyStateName = null;
      if (projectData.assignFromCompany.stateCode) {
        assignFromCompanyStateName =
          await this.countryStateCityService.getStateByCode(
            projectData.assignFromCompany.stateCode,
            projectData.assignFromCompany.countryCode,
          );
      }
      if (projectData.assignToCompany.stateCode) {
        assignToCompanyStateName =
          await this.countryStateCityService.getStateByCode(
            projectData.assignToCompany.stateCode,
            projectData.assignToCompany.countryCode,
          );
      }
      const extendedAssignFromCompany: ExtendedCompany = {
        ...projectData.assignFromCompany,
        countryName: assignFromCompanyCountryName,
        stateName: assignFromCompanyStateName,
      };

      const extendedAssignToCompany: ExtendedCompany = {
        ...projectData.assignToCompany,
        countryName: assignToCompanyCountryName,
        stateName: assignToCompanyStateName,
      };
      return {
        ...projectData,
        assignFromCompany: extendedAssignFromCompany,
        assignToCompany: extendedAssignToCompany,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    currentUser: JwtPayload,
  ) {
    try {
      const isProjectExists = await (
        await this.getProjectWithJoins(id)
      ).getOne();

      if (!isProjectExists) {
        throw CustomError(
          PROJECT_RESPONSE_MESSAGES.PROJECT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      if (updateProjectDto.projectManagerId === 0) {
        delete updateProjectDto.projectManagerId;
        delete isProjectExists.projectManager;
      }

      if (!updateProjectDto.projectManagerId) {
        updateProjectDto.projectManagerId = isProjectExists.projectManagerId;
      }

      if (
        updateProjectDto.billingType === BillingType.FIXED &&
        updateProjectDto.milestones.length > 0
      ) {
        for (const milestone of updateProjectDto.milestones) {
          milestone.projectId = id;
          if (milestone.id) {
            await this.mileStoneService.update(milestone.id, milestone);
          } else {
            await this.mileStoneService.create(milestone);
          }
        }
      }
      updateProjectDto.updatedBy = currentUser.id;
      const updatedData: any = { ...isProjectExists, ...updateProjectDto };
      const updatedProject = await this.projectRepository.save(updatedData);
      return updatedProject;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async remove(id: number) {
    try {
      const isProjectExists = await this.projectRepository.findOneBy({ id });
      if (!isProjectExists) {
        throw CustomError(
          PROJECT_RESPONSE_MESSAGES.PROJECT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.mileStoneService.removeByProjectId(id);
      await this.projectRepository.softDelete({ id });
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async changeProjectStatus(id: number, status: ProjectStatus) {
    try {
      const isProjectExists = await (
        await this.getProjectWithJoins(id)
      ).getOne();
      if (!isProjectExists) {
        throw CustomError(
          PROJECT_RESPONSE_MESSAGES.PROJECT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      if (isProjectExists.projectManagerId === 0) {
        delete isProjectExists.projectManager;
      }

      isProjectExists.status = status;
      const updatedProject = await this.projectRepository.save(isProjectExists);

      return updatedProject;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getProjectByName(name: string) {
    return await this.projectRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  private async getProjectWithJoins(id: number) {
    return this.projectRepository
      .createQueryBuilder("project")
      .where({ id })
      .leftJoinAndSelect("project.client", "client")
      .leftJoinAndSelect("client.company", "company")
      .leftJoinAndSelect("project.assignToCompany", "assignToCompany")
      .leftJoinAndSelect("project.assignFromCompany", "assignFromCompany")
      .leftJoinAndSelect("project.projectManager", "projectManager")
      .leftJoinAndSelect("project.teamLeader", "teamLeader")
      .leftJoinAndSelect("project.milestones", "milestones")
      .leftJoinAndSelect("project.crs", "crs")
      .leftJoinAndSelect("project.developers", "developers");
  }

  async exportProjects(params: ListProjectDto, response: Response) {
    try {
      const queryBuilder = this.projectRepository.createQueryBuilder("project");

      if (params.search) {
        queryBuilder.where(
          "project.name ILIKE :search OR project.status ILIKE :search OR project.description ILIKE :search OR project.client.name ILIKE :search OR project.assignToCompany.name ILIKE :search OR project.projectManager ILIKE :search OR project.startDate ILIKE :search OR project.endDate ILIKE :search OR project.teamLead ILIKE :search",
          {
            search: `%${params.search}%`,
          },
        );
      }

      if (params.isInternalProject) {
        queryBuilder.andWhere(
          "project.isInternalProject = :isInternalProject",
          {
            isInternalProject: params.isInternalProject,
          },
        );
      }

      queryBuilder
        .leftJoinAndSelect("project.client", "client")
        .leftJoinAndSelect("client.company", "company")
        .leftJoinAndSelect("project.assignToCompany", "assignToCompany")
        .leftJoinAndSelect("project.assignFromCompany", "assignFromCompany")
        .leftJoinAndSelect("project.projectManager", "projectManager")
        .leftJoinAndSelect("project.teamLeader", "teamLeader")
        .where("project.deletedAt IS NULL");

      const projects = await queryBuilder.getMany();

      // Extend project details
      const projectList = await Promise.all(
        projects.map(async (project) => {
          const assignFromCompanyCountryName =
            await this.countryStateCityService.getCountryByCode(
              project.assignFromCompany.countryCode,
            );
          const assignToCompanyCountryName =
            await this.countryStateCityService.getCountryByCode(
              project.assignToCompany.countryCode,
            );
          let assignFromCompanyStateName = null;
          let assignToCompanyStateName = null;

          if (project.assignFromCompany.stateCode) {
            assignFromCompanyStateName =
              await this.countryStateCityService.getStateByCode(
                project.assignFromCompany.stateCode,
                project.assignFromCompany.countryCode,
              );
          }
          if (project.assignToCompany.stateCode) {
            assignToCompanyStateName =
              await this.countryStateCityService.getStateByCode(
                project.assignToCompany.stateCode,
                project.assignToCompany.countryCode,
              );
          }

          const extendedAssignFromCompany: ExtendedCompany = {
            ...project.assignFromCompany,
            countryName: assignFromCompanyCountryName,
            stateName: assignFromCompanyStateName,
          };

          const extendedAssignToCompany: ExtendedCompany = {
            ...project.assignToCompany,
            countryName: assignToCompanyCountryName,
            stateName: assignToCompanyStateName,
          };

          return {
            ...project,
            assignFromCompany: extendedAssignFromCompany,
            assignToCompany: extendedAssignToCompany,
          };
        }),
      );

      // Generate Excel
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Projects");

      // Add Headers
      const headers = [
        "Project Name",
        "Description",
        "Start Date",
        "End Date",
        "Status",
        "Client Name",
        "Assign To Company",
        "Project Manager",
        "Team Leader",
        "Billing type",
        "Hourly rate",
        "Project hours",
        "Total hours",
        "Currency",
      ];
      sheet.addRow(headers);

      // Add Data Rows
      projectList.forEach((project) => {
        sheet.addRow([
          project.name,
          project.description,
          project.startDate || "",
          project.endDate || "",
          project.status,
          project.client?.firstName ||
            "" + " " + project.client?.lastName ||
            "",
          project.assignToCompany?.name || "",
          project.projectManager?.firstName ||
            "" + " " + project.projectManager?.lastName ||
            "",
          project.teamLeader?.firstName ||
            "" + " " + project.teamLeader?.lastName ||
            "",
          project.billingType,
          project.hourlyMonthlyRate,
          project.projectHours,
          project.projectCost,
          project.currency,
        ]);
      });

      // Write Excel to Buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Set Response Headers for Download
      response.setHeader(
        "Content-Disposition",
        `attachment; filename="Projects_${Date.now()}.xlsx"`,
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
