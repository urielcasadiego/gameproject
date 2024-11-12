import { JwtService } from "@nestjs/jwt";
import { User } from "./interface/user.interface";
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    login(user: User): Promise<{
        access_token: string;
    }>;
}
