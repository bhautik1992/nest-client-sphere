import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { USER_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";
import { JwtPayload } from "src/common/interfaces/jwt.interface";
import { Repository } from "typeorm";
import { Users } from "../users/entity/user.entity";
import { Clients } from "../client/entity/client.entity";
import { Projects } from "../project/entity/project.entity";
import { Companies } from "../company/entity/company.entity";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Clients)
    private readonly clientRepository: Repository<Clients>,
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
    @InjectRepository(Companies)
    private readonly companyRepository: Repository<Companies>,
  ) {}

  async getDashboardCount() {
    const [usersCount, clientsCount, projectsCount, companiesCount] =
      await Promise.all([
        this.userRepository.count(),
        this.clientRepository.count(),
        this.projectRepository.count(),
        this.companyRepository.count(),
      ]);

    return { usersCount, clientsCount, projectsCount, companiesCount };
  }

  async getUserProfile(user: JwtPayload) {
    try {
      const loggedUser = await this.userRepository.findOneBy({ id: user.id });
      if (!loggedUser) {
        throw CustomError(
          USER_RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return loggedUser;
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

  async getUserList() {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder("user");
      return await queryBuilder
        .select([
          "user.id",
          "user.firstName",
          "user.lastName",
          "user.personalEmail",
          "user.companyEmail",
          "user.designation",
        ])
        .getMany();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}
