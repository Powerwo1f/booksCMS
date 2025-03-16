import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { UsersModule } from "./users/users.module";
import { GraphQLModule } from "@nestjs/graphql";
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        UsersModule,
        GraphQLModule.forRoot({
            autoSchemaFile: "schema.gql",
            playground: true, // удобно для тестов
        }),
        AuthModule,
        // другие модули
    ],
})
export class AppModule {}
