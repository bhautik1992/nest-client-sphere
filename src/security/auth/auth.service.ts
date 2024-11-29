import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { ChangePasswordDto, LoginDto } from "../../common/dto/common.dto";
import { AuthExceptions, CustomError } from "src/common/helpers/exceptions";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "src/users/dto/create-user.dto";
const bcrypt = require("bcryptjs");

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(params: LoginDto) {
    const user = await this.userRepository.findOneBy({
      email: params.email,
    });

    if (!user) {
      throw AuthExceptions.AccountNotExist();
    }
    if (!(await bcrypt.compareSync(params.password, user.password))) {
      throw AuthExceptions.InvalidIdPassword();
    }
    delete user.password;
    const payload = {
      id: user.id,
      name: user.first_name,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_TOKEN_SECRET,
        expiresIn: process.env.JWT_TONE_EXPIRY_TIME,
      }),
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
  }

  async changePassword(body: ChangePasswordDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: body.id });
      if (!user) {
        throw AuthExceptions.AccountNotExist();
      }
      const isPasswordMatch = await bcrypt.compareSync(
        body.current_password,
        user.password,
      );
      if (!isPasswordMatch) {
        throw AuthExceptions.InvalidIdPassword();
      }
      user.password = await bcrypt.hash(body.new_password, 10);
      await this.userRepository.save(user);
      return {};
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async createInitialUser(): Promise<void> {
    const user = await this.userRepository.findOneBy({
      email: this.configService.get("database.initialUser.email"),
    });

    if (user) {
      console.log("Initial user already loaded.");
    } else {
      const params: CreateUserDto = {
        first_name: this.configService.get("database.initialUser.first_name"),
        last_name: this.configService.get("database.initialUser.last_name"),
        role: this.configService.get("database.initialUser.role"),
        email: this.configService.get("database.initialUser.email"),
        phone: this.configService.get("database.initialUser.phone"),
        password: "",
      };
      params.password = await bcrypt.hash(
        this.configService.get("database.initialUser.password"),
        10,
      );
      const user = this.userRepository.create(params);
      await this.userRepository.save(user);
      console.log("Initial user loaded successfully.");
    }
  }
}
