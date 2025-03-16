import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersResolver } from "./controllers/users.resolver";
import { UsersService } from "./services/users.service";
import { UserEntity } from "./entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UsersResolver],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
