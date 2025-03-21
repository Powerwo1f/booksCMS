import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { UsersModule } from "./users/users.module";
import { GraphQLModule } from "@nestjs/graphql";
import { AuthModule } from "./auth/auth.module";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ActivityLogModule } from "./activity-log/activity-log.module";
import { PermissionsGuard } from "./common/guards/permissions.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ActivityLogModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        ActivityLogModule,
        UsersModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true, // или путь к схеме, например 'schema.gql'
            playground: true, // по желанию
            debug: true, // по желанию
        }),
        AuthModule,
        BooksModule,
        ReviewsModule,
        // другие модули
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: PermissionsGuard,
        },
    ],
})
export class AppModule {}
