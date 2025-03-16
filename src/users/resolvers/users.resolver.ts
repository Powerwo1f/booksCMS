import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UsersService } from "../services/users.service";
import { UserEntity } from "../entities/user.entity";
import { CreateUserInput } from "../dto/create-user.input";
import { UpdateUserInput } from "../dto/update-user.input";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";
import { PermissionsGuard } from "../../common/guards/permissions.guard";

@Resolver(() => UserEntity)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => [UserEntity])
    @UseGuards(GqlAuthGuard, PermissionsGuard)
    @Permissions("READ_USER")
    findAll() {
        return this.usersService.findAll();
    }

    @Query(() => UserEntity)
    @UseGuards(GqlAuthGuard)
    findOne(@Args("id", { type: () => ID }) id: string) {
        return this.usersService.findOne(id);
    }

    @Mutation(() => UserEntity)
    createUser(@Args("input") input: CreateUserInput) {
        return this.usersService.create(input);
    }

    @Mutation(() => UserEntity)
    @UseGuards(GqlAuthGuard)
    updateUser(@Args("input") input: UpdateUserInput) {
        const { id, ...rest } = input;
        return this.usersService.update(id, rest);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard, PermissionsGuard)
    @Permissions("DELETE_USER")
    removeUser(@Args("id", { type: () => ID }) id: string) {
        return this.usersService.remove(id);
    }
}
