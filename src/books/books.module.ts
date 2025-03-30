import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookEntity } from "./entities/book.entity";
import { BooksService } from "./services/books.service";
import { BooksResolver } from "./resolvers/books.resolver";
import { BooksStorageService } from "./services/books-storage.service";
import { ScheduleModule } from "@nestjs/schedule";
import { BookFileScannerService } from "./services/books-file-scanner.service";

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity]), ScheduleModule.forRoot()],
    providers: [BooksService, BooksResolver, BooksStorageService, BookFileScannerService],
})
export class BooksModule {}
