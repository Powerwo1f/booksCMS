import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersResolver } from "./resolvers/users.resolver";
import { UsersService } from "./services/users.service";
import { UserEntity } from "./entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [],
    providers: [UsersService, UsersResolver],
    exports: [UsersService],
})
export class UsersModule {}
