import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { ListDto, LoginDto } from "../common/dto/common.dto";
import {
  AuthExceptions,
  CustomError,
  TypeExceptions,
} from "../common/helpers/exceptions";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Users } from "./entity/user.entity";
import { RESPONSE_MESSAGES } from "src/common/constants/response.constant";

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check duplicate user
    if (await this.getUserByEmail(createUserDto.email)) {
      throw TypeExceptions.UserAlreadyExists();
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(
      this.configService.get("database.initialUser.password"),
      salt
    );
    createUserDto.password = hash;
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(params: ListDto) {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder("user");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "(user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search)",
          { search: `%${params.search}%` }
        );
      }

      // Apply pagination
      queryBuilder
        .skip((params.page - 1) * params.limit)
        .take(params.limit)
        .select([
          "user.id",
          "user.first_name",
          "user.last_name",
          "user.email",
          "user.is_active",
        ])
        .orderBy("user.id", "ASC");
      const users = await queryBuilder.getMany();
      return users;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(userId: number) {
    try {
      const userExits = await this.userRepository.findOneBy({ id: userId });
      if (!userExits) {
        throw CustomError(
          RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }
      return this.userRepository
        .createQueryBuilder("user")
        .where({ id: userId })
        .getOne();
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const userExits = await this.userRepository.findOneBy({ id: userId });
      if (!userExits) {
        throw CustomError(
          RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }
      return this.userRepository.update(userId, updateUserDto);
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async remove(userId: number) {
    return await this.userRepository.delete({ id: userId });
  }

  async createInitialUser(): Promise<void> {
    const user = await this.getUserByEmail(
      this.configService.get("database.initialUser.email")
    );

    if (user) {
      console.log("Initial user already loaded.");
    } else {
      const params: CreateUserDto = {
        first_name: this.configService.get("database.initialUser.first_name"),
        last_name: this.configService.get("database.initialUser.last_name"),
        role: this.configService.get("database.initialUser.role"),
        email: this.configService.get("database.initialUser.email"),
        password: "",
      };

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(
        this.configService.get("database.initialUser.password"),
        salt
      );
      params.password = hash;
      const user = this.userRepository.create(params);
      await this.userRepository.save(user);
      console.log("Initial user loaded successfully.");
    }
  }

  async login(params: LoginDto) {
    const user = await this.userRepository.findOneBy({
      email: params.email,
    });
    if (!user) {
      throw AuthExceptions.AccountNotExist();
    }

    if (!bcrypt.compareSync(params.password, user.password)) {
      throw AuthExceptions.InvalidIdPassword();
    }
    delete user.password;
    return user;
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
