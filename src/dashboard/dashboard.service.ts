import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Clients } from "src/client/entity/client.entity";
import { USER_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";
import { JwtPayload } from "src/common/interfaces/jwt.interface";
import { Companies } from "src/company/entity/company.entity";
import { Projects } from "src/project/entity/project.entity";
import { Users } from "src/users/entity/user.entity";
import { Repository } from "typeorm";

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
      const queryBuilder = this.clientRepository.createQueryBuilder("client");
      return await queryBuilder.select(["client.id", "client.name"]).getMany();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getCompanyList() {
    try {
      const queryBuilder = this.companyRepository.createQueryBuilder("company");
      return await queryBuilder
        .select(["company.id", "company.name"])
        .getMany();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}
