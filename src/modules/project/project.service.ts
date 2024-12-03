import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PROJECT_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ListDto } from "src/common/dto/common.dto";
import { CustomError } from "src/common/helpers/exceptions";

import { Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Projects } from "./entity/project.entity";
import { ProjectStatus } from "src/common/constants/enum.constant";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      if (await this.getProjectByName(createProjectDto.name)) {
        throw CustomError(
          PROJECT_RESPONSE_MESSAGES.PROJECT_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      const project = this.projectRepository.create(createProjectDto);
      const createdProject = await this.projectRepository.save(project);
      return createdProject;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findAll(params: ListDto) {
    try {
      const queryBuilder = this.projectRepository.createQueryBuilder("project");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where("project.name ILIKE :search", {
          search: `%${params.search}%`,
        });
      }

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

      queryBuilder.leftJoinAndSelect("project.client", "client");
      const projects = await queryBuilder.getMany();
      // Get the total count based on the original query
      const recordsTotal = await totalQuery.getCount();
      return {
        result: projects,
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
      const queryBuilder = this.projectRepository
        .createQueryBuilder("project")
        .where({ id })
        .leftJoinAndSelect("project.client", "client")
        .orderBy("project.id", "ASC");
      return await queryBuilder.getOne();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const queryBuilder = this.projectRepository.createQueryBuilder("project");
      const isProjectExists = await queryBuilder
        .where({ id })
        .leftJoinAndSelect("project.client", "client")
        .getOne();
      if (!isProjectExists) {
        throw CustomError(
          PROJECT_RESPONSE_MESSAGES.PROJECT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
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
      await this.projectRepository.delete({ id });
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getProjectByName(name: string) {
    return await this.projectRepository.findOneBy({ name });
  }

  async changeProjectStatus(id: number, status: ProjectStatus) {
    try {
      const queryBuilder = this.projectRepository.createQueryBuilder("project");
      const isProjectExists = await queryBuilder
        .where({ id })
        .leftJoinAndSelect("project.client", "client")
        .getOne();
      if (!isProjectExists) {
        throw CustomError(
          PROJECT_RESPONSE_MESSAGES.PROJECT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      isProjectExists.status = status;
      const updatedProject = await this.projectRepository.save(isProjectExists);

      return updatedProject;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}
