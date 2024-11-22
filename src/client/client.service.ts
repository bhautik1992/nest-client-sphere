import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Clients } from "./entity/client.entity";
import { Repository } from "typeorm";
import { CreateClientDto } from "./dto/create-client.dto";
import { CustomError } from "src/common/helpers/exceptions";
import { CLIENT_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { ListDto } from "src/common/dto/common.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientRepository: Repository<Clients>,
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

      // Apply pagination
      if (params.page && params.limit) {
        queryBuilder.skip((params.page - 1) * params.limit);
        queryBuilder.take(params.limit);
      }

      queryBuilder
        .select([
          "client.id",
          "client.name",
          "client.phone",
          "client.email",
          "client.address",
          "client.gender",
          "client.country",
          "client.status",
        ])
        .leftJoinAndSelect("client.projects", "project") // Join with the Project entity
        .orderBy("client.id", "ASC");

      // Fetch the results (clients and associated projects)
      const clients = await queryBuilder.getMany();

      return clients;
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
        .leftJoinAndSelect("client.projects", "project") // Join with the Project entity
        .orderBy("client.id", "ASC");

      // Fetch the results (clients and associated projects)
      const client = await queryBuilder.getOne();
      return client;
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

  async getClientByEmail(email: string) {
    return await this.clientRepository.findOneBy({ email });
  }
}
