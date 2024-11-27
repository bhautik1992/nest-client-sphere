import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hash } from "bcrypt";
import { Repository } from "typeorm";
import { ListDto } from "../common/dto/common.dto";
import { CustomError, TypeExceptions } from "../common/helpers/exceptions";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Users } from "./entity/user.entity";
import { USER_RESPONSE_MESSAGES } from "src/common/constants/response.constant";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.getUserByEmail(createUserDto.email)) {
      throw TypeExceptions.UserAlreadyExists();
    }
    createUserDto.password = await hash(`${createUserDto.first_name}@123`, 10);
    const user = this.userRepository.create(createUserDto);
    const createdUser = await this.userRepository.save(user);
    delete createdUser.password;
    return createdUser;
  }

  async findAll(params: ListDto) {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder("user");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "(user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search)",
          { search: `%${params.search}%` },
        );
      }

      const totalQuery = queryBuilder.clone();

      // Apply sorting
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `user.${params.sortBy}`,
          params.sortOrder === "asc" ? "ASC" : "DESC",
        );
      } else {
        queryBuilder.orderBy("user.createdAt", "DESC");
      }

      // Apply pagination
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset);
        queryBuilder.take(params.limit);
      }

      queryBuilder.select([
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "user.role",
      ]);
      const users = await queryBuilder.getMany();
      const recordsTotal = await totalQuery.getCount();
      return {
        result: users,
        recordsTotal,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(userId: number) {
    try {
      const userExits = await this.userRepository.findOneBy({ id: userId });
      if (!userExits) {
        throw CustomError(
          USER_RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
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
          USER_RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return this.userRepository.update(userId, updateUserDto);
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async remove(userId: number) {
    try {
      const isUserExists = await this.userRepository.findOneBy({ id: userId });
      if (!isUserExists) {
        throw CustomError(
          USER_RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.userRepository.delete({ id: userId });
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
