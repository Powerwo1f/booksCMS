import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "../services/auth.service";
import { AuthResponse } from "../dto/auth-response.dto";
import { LoginInput } from "../dto/login.input";

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthResponse)
    async login(@Args("input") input: LoginInput) {
        return this.authService.login(input.email, input.password);
    }
}
