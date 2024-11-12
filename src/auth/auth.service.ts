import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { User } from "./interface/user.interface";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login(user: User) {
    const payload = { username: user.username, sub: user.userId };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
