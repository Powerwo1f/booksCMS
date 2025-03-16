import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./services/auth.service";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UsersModule } from "../users/users.module";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: "your_jwt_secret", // лучше вынести в env
            signOptions: { expiresIn: "1h" },
        }),
    ],
    providers: [AuthService, AuthResolver, JwtStrategy],
})
export class AuthModule {}
