import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookEntity } from "../entities/book.entity";
import { CreateBookInput } from "../dto/create-book.input";
import { UpdateBookInput } from "../dto/update-book.input";
import { CreateBookResponse } from "../dto/create-book.response";
import { BooksStorageService } from "./books-storage.service";

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepo: Repository<BookEntity>,
        private readonly booksStorageService: BooksStorageService,
    ) {}

    async create(createBookInput: CreateBookInput): Promise<CreateBookResponse> {
        const book = this.bookRepo.create(createBookInput);
        const savedBook = await this.bookRepo.save(book);

        const presignedUrl = await this.booksStorageService.generateUploadUrl(savedBook.id);

        return {
            book: savedBook,
            presignedUrl,
        };
    }

    async findAll(): Promise<BookEntity[]> {
        return this.bookRepo.find();
    }

    async findOne(id: string): Promise<BookEntity> {
        const book = await this.bookRepo.findOne({ where: { id } });
        if (!book) throw new NotFoundException("Book not found");
        return book;
    }

    async update(id: string, updateBookInput: UpdateBookInput): Promise<BookEntity> {
        const book = await this.findOne(id);
        Object.assign(book, updateBookInput);
        return this.bookRepo.save(book);
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.bookRepo.delete(id);
        return result.affected > 0;
    }
}
