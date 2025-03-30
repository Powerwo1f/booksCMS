import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookEntity } from "./entities/book.entity";
import { BooksService } from "./services/books.service";
import { BooksResolver } from "./resolvers/books.resolver";
import { BooksStorageService } from "./services/books-storage.service";

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity])],
    providers: [BooksService, BooksResolver, BooksStorageService],
})
export class BooksModule {}
