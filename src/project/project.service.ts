import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Projects } from "./entity/project.entity";
import { Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { CustomError } from "src/common/helpers/exceptions";
import { PROJECT_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ListDto } from "src/common/dto/common.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

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
        queryBuilder.where("project.name LIKE :search", {
          search: `%${params.search}%`,
        });
      }

      // Apply pagination if page and limit are provided
      if (params.page && params.limit) {
        queryBuilder.skip((params.page - 1) * params.limit).take(params.limit);
      }

      queryBuilder
        .select(["project.id", "project.name", "project.description"])
        .leftJoinAndSelect("project.client", "client")
        .leftJoinAndSelect("project.company", "company")
        .orderBy("project.id", "ASC");

      const projects = await queryBuilder.getMany();
      return projects;
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
        .leftJoinAndSelect("project.company", "company")
        .orderBy("project.id", "ASC");
      return await queryBuilder.getOne();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const isProjectExists = await this.projectRepository.findOneBy({ id });
      if (!isProjectExists) {
        throw CustomError(
          PROJECT_RESPONSE_MESSAGES.PROJECT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.projectRepository.update(id, updateProjectDto);
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
}
