import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { UsersModule } from "./users/users.module";
import { GraphQLModule } from "@nestjs/graphql";

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        UsersModule,
        GraphQLModule.forRoot({
            autoSchemaFile: "schema.gql",
            playground: true, // удобно для тестов
        }),
        // другие модули
    ],
})
export class AppModule {}
