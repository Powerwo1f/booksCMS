import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../users/services/users.service";
import * as bcrypt from "bcrypt";
import { AccessToken } from "../interfaces/access-token.interface";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(email: string, password: string): Promise<AccessToken> {
        const user = await this.usersService.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = {
            sub: user.id,
            email: user.email,
            permissions: user.permissions.map((perm) => perm.permission.name),
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
