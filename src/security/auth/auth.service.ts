import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../../common/dto/common.dto";
import { UsersService } from "../../users/users.service";
import { JwtPayload } from "../../common//interfaces/jwt.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(params: LoginDto) {
    const user = await this.userService.login(params);
    const access_token = this.generateAuthToken(user);
    user["access_token"] = access_token;
    return user;
  }

  generateAuthToken(user) {
    const payload: JwtPayload = {
      id: user.id,
      userId: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
