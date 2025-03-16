import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UsersService } from "../services/users.service";
import { UserEntity } from "../entities/user.entity";
import { CreateUserInput } from "../dto/create-user.input";
import { UpdateUserInput } from "../dto/update-user.input";

@Resolver(() => UserEntity)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => [UserEntity], { name: "users" })
    findAll() {
        return this.usersService.findAll();
    }

    @Query(() => UserEntity, { name: "user" })
    findOne(@Args("id", { type: () => ID }) id: string) {
        return this.usersService.findOne(id);
    }

    @Mutation(() => UserEntity)
    createUser(@Args("input") input: CreateUserInput) {
        return this.usersService.create(input);
    }

    @Mutation(() => UserEntity)
    updateUser(@Args("input") input: UpdateUserInput) {
        const { id, ...updateData } = input;
        return this.usersService.update(id, updateData);
    }

    @Mutation(() => Boolean)
    removeUser(@Args("id", { type: () => ID }) id: string) {
        return this.usersService.remove(id).then(() => true);
    }
}
