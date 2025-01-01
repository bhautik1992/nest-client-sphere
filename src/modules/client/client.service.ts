import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientStatus } from "src/common/constants/enum.constant";
import { CLIENT_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";
import { Repository } from "typeorm";
import { CountryStateCityService } from "../country-state-city/country-state-city.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { ListClientDto } from "./dto/list-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Clients } from "./entity/client.entity";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientRepository: Repository<Clients>,
    private readonly countryStateCityService: CountryStateCityService,
  ) {}

  async create(createClientDto: CreateClientDto) {
    if (await this.getClientByEmail(createClientDto.email)) {
      throw CustomError(
        CLIENT_RESPONSE_MESSAGES.CLIENT_ALREADY_EXISTS,
        HttpStatus.NOT_FOUND,
      );
    }
    const client = this.clientRepository.create(createClientDto);
    const createdClient = await this.clientRepository.save(client);
    return createdClient;
  }

  async findAll(params: ListClientDto) {
    try {
      const queryBuilder = this.clientRepository.createQueryBuilder("client");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "(client.firstName ILIKE :search OR client.lastName ILIKE :search OR client.phone ILIKE :search OR client.email ILIKE :search OR client.clientCompanyName ILIKE :search)",
          { search: `%${params.search}%` },
        );
      }

      if (params.accountManagerId)
        queryBuilder.andWhere("client.accountManagerId = :accountManagerId", {
          accountManagerId: params.accountManagerId,
        });
      if (params.email)
        queryBuilder.andWhere("client.email ILIKE :email", {
          email: params.email,
        });
      if (params.name)
        queryBuilder.andWhere("client.firstName ILIKE :name", {
          name: params.name,
        });
      if (params.status)
        queryBuilder.andWhere("client.status = :status", {
          status: params.status,
        });

      const totalQuery = queryBuilder.clone();

      // Apply pagination
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset);
        queryBuilder.take(params.limit);
      }

      // Apply sorting
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `client.${params.sortBy}`,
          params.sortOrder === "asc" ? "ASC" : "DESC",
        );
      } else {
        queryBuilder.orderBy("client.createdAt", "DESC");
      }

      queryBuilder
        .leftJoinAndSelect("client.projects", "project") // Join with the Project entity
        .leftJoinAndSelect("client.company", "company")
        .leftJoinAndSelect("client.accountManager", "accountManager");

      if (params.deletedClient) {
        queryBuilder.withDeleted();
        queryBuilder.andWhere("client.deletedAt IS NOT NULL");
      }

      // Fetch the results (clients and associated projects)
      const clients = await queryBuilder.getMany();

      const clientList = await Promise.all(
        clients.map(async (client) => {
          const countryName =
            await this.countryStateCityService.getCountryByCode(
              client.countryCode,
            );
          let stateName = null;
          if (client.stateCode) {
            stateName = await this.countryStateCityService.getStateByCode(
              client.stateCode,
              client.countryCode,
            );
          }
          return {
            ...client,
            countryName,
            stateName,
          };
        }),
      );

      // Fetch the total count
      const recordsTotal = await totalQuery.getCount();

      return { result: clientList, recordsTotal };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(id: number) {
    try {
      const isClientExists = await this.clientRepository.findOneBy({ id });
      if (!isClientExists) {
        throw CustomError(
          CLIENT_RESPONSE_MESSAGES.CLIENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const queryBuilder = this.clientRepository
        .createQueryBuilder("client")
        .where({ id })
        .leftJoinAndSelect("client.projects", "project")
        .leftJoinAndSelect("client.company", "company")
        .leftJoinAndSelect("client.accountManager", "accountManager")
        .where("project.deletedAt IS NULL");

      // Fetch the results (clients and associated projects)
      const client = await queryBuilder.getOne();
      const countryName = await this.countryStateCityService.getCountryByCode(
        client.countryCode,
      );
      let stateName = null;
      if (client.stateCode) {
        stateName = await this.countryStateCityService.getStateByCode(
          client.stateCode,
          client.countryCode,
        );
      }
      return { ...client, countryName, stateName };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      const isClientExists = await this.clientRepository.findOneBy({ id });
      if (!isClientExists) {
        throw CustomError(
          CLIENT_RESPONSE_MESSAGES.CLIENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const updatedEntity = { id, ...updateClientDto };
      const updatedClient = await this.clientRepository.save(updatedEntity);
      return updatedClient;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async remove(id: number) {
    try {
      const isClientExists = await this.clientRepository.findOneBy({ id });
      if (!isClientExists) {
        throw CustomError(
          CLIENT_RESPONSE_MESSAGES.CLIENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.clientRepository.softDelete({ id });
    } catch (error) {
      CustomError(error.message, error.statusCode);
    }
  }

  async changeStatus(id: number, status: ClientStatus) {
    try {
      const queryBuilder = this.clientRepository.createQueryBuilder("client");
      const isClientExists = await queryBuilder
        .where({ id })
        .leftJoinAndSelect("client.projects", "project")
        .leftJoinAndSelect("client.accountManager", "accountManager")
        .getOne();
      if (!isClientExists) {
        throw CustomError(
          CLIENT_RESPONSE_MESSAGES.CLIENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      isClientExists.status = status;
      const updatedClient = await this.clientRepository.save(isClientExists);

      return updatedClient;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getClientByEmail(email: string) {
    return await this.clientRepository.findOneBy({ email });
  }
}
