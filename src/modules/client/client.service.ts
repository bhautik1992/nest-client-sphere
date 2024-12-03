import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Clients } from "./entity/client.entity";
import { Repository } from "typeorm";
import { CreateClientDto } from "./dto/create-client.dto";
import { CustomError } from "src/common/helpers/exceptions";
import { CLIENT_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ListDto } from "src/common/dto/common.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { CountryStateCityService } from "../country-state-city/country-state-city.service";
import { ClientStatus } from "src/common/constants/enum.constant";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientRepository: Repository<Clients>,
    private readonly countryStateCityService: CountryStateCityService,
  ) {}

  async create(createUserDto: CreateClientDto) {
    if (await this.getClientByEmail(createUserDto.email)) {
      throw CustomError(
        CLIENT_RESPONSE_MESSAGES.CLIENT_ALREADY_EXISTS,
        HttpStatus.NOT_FOUND,
      );
    }
    const client = this.clientRepository.create(createUserDto);
    const createdClient = await this.clientRepository.save(client);
    return createdClient;
  }

  async findAll(params: ListDto) {
    try {
      const queryBuilder = this.clientRepository.createQueryBuilder("client");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "(client.name ILIKE :search OR client.phone ILIKE :search OR client.email ILIKE :search)",
          { search: `%${params.search}%` },
        );
      }

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

      queryBuilder.leftJoinAndSelect("client.projects", "project"); // Join with the Project entity

      // Fetch the results (clients and associated projects)
      const clients = await queryBuilder.getMany();

      const clientList = await Promise.all(
        clients.map(async (client) => {
          const countryName =
            await this.countryStateCityService.getCountryByCode(
              client.countryCode,
            );
          const stateName = await this.countryStateCityService.getStateByCode(
            client.stateCode,
            client.countryCode,
          );
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
        .leftJoinAndSelect("client.projects", "project");

      // Fetch the results (clients and associated projects)
      const client = await queryBuilder.getOne();
      const countryName = await this.countryStateCityService.getCountryByCode(
        client.countryCode,
      );
      const stateName = await this.countryStateCityService.getStateByCode(
        client.stateCode,
        client.countryCode,
      );
      return { ...client, countryName, stateName };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(id: number, updateUserDto: UpdateClientDto) {
    try {
      const isClientExists = await this.clientRepository.findOneBy({ id });
      if (!isClientExists) {
        throw CustomError(
          CLIENT_RESPONSE_MESSAGES.CLIENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return this.clientRepository.update(id, updateUserDto);
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
      return await this.clientRepository.delete({ id });
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