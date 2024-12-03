import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChangePasswordDto, LoginDto } from "../../common/dto/common.dto";
import { AuthExceptions, CustomError } from "src/common/helpers/exceptions";
import { ConfigService } from "@nestjs/config";
import { Users } from "src/modules/users/entity/user.entity";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";
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
      companyEmail: params.email,
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
      name: user.firstName,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_TOKEN_SECRET,
        expiresIn: process.env.JWT_TONE_EXPIRY_TIME,
      }),
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      personalEmail: user.personalEmail,
      companyEmail: user.companyEmail,
    };
  }

  async changePassword(body: ChangePasswordDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: body.id });
      if (!user) {
        throw AuthExceptions.AccountNotExist();
      }
      const isPasswordMatch = await bcrypt.compareSync(
        body.currentPassword,
        user.password,
      );
      if (!isPasswordMatch) {
        throw AuthExceptions.InvalidIdPassword();
      }
      user.password = await bcrypt.hash(body.newPassword, 10);
      await this.userRepository.save(user);
      return {};
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async createInitialUser(): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [
        {
          personalEmail: this.configService.get(
            "database.initialUser.personalEmail",
          ),
        },
        {
          companyEmail: this.configService.get(
            "database.initialUser.companyEmail",
          ),
        },
      ],
    });

    if (user) {
      console.log("Initial user already loaded.");
    } else {
      const params: CreateUserDto = {
        firstName: this.configService.get("database.initialUser.firstName"),
        lastName: this.configService.get("database.initialUser.lastName"),
        role: this.configService.get("database.initialUser.role"),
        personalEmail: this.configService.get(
          "database.initialUser.personalEmail",
        ),
        companyEmail: this.configService.get(
          "database.initialUser.companyEmail",
        ),
        phone: this.configService.get("database.initialUser.phone"),
        department: this.configService.get("database.initialUser.department"),
        designation: this.configService.get("database.initialUser.designation"),
        dateOfBirth: this.configService.get("database.initialUser.dateOfBirth"),
        joiningDate: this.configService.get("database.initialUser.joiningDate"),
        reportingPerson: this.configService.get(
          "database.initialUser.reportingPerson",
        ),
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
