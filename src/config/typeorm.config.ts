import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + "/../**/*.entity.{js,ts}"],
    synchronize: false, // Миграции используем!
    migrationsRun: false,
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
};
