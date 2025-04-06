import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { UsersModule } from "./users/users.module";
import { GraphQLModule } from "@nestjs/graphql";
import { AuthModule } from "./auth/auth.module";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
import { BooksModule } from "./books/books.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { ActivityLogModule } from "./activity-log/activity-log.module";
import { PermissionsGuard } from "./common/guards/permissions.guard";
import { APP_GUARD } from "@nestjs/core";
import { GqlAuthGuard } from "./common/guards/gql-auth.guard";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { GqlThrottlerGuard } from "./common/guards/graphql-throttler.guard";

@Module({
    imports: [
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000, // время жизни окна (в миллисекундах)
                    limit: 1, // кол-во запросов в окно
                    // Это значит: 10 запросов в минуту на 1 IP.
                },
            ],
        }),
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
            debug: false, // по желанию
            context: ({ req, res }) => ({ req, res }),
            formatError: error => {
                const formatted: any = {
                    message: error.message,
                    extensions: error.extensions,
                };

                // Опционально убираем лишнее
                delete formatted.extensions?.exception;
                delete formatted.extensions?.stacktrace;

                return formatted;
            },
        }),
        AuthModule,
        BooksModule,
        ReviewsModule,
        ScheduleModule.forRoot(),
        // другие модули
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: GqlAuthGuard, // <- первым идёт аутентификация!
        },
        {
            provide: APP_GUARD,
            useClass: GqlThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionsGuard, // <- потом проверка пермишенов!
        },
    ],
})
export class AppModule {}
