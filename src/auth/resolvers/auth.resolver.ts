import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "../services/auth.service";
import { AuthResponse } from "../dto/auth-response.dto";
import { LoginInput } from "../dto/login.input";
import { AccessToken } from "../interfaces/access-token.interface";

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthResponse)
    async login(@Args("input") input: LoginInput): Promise<AccessToken> {
        return this.authService.login(input.email, input.password);
    }
}
