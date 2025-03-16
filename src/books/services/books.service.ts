import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookEntity } from "../entities/book.entity";
import { CreateBookInput } from "../dto/create-book.input";
import { UpdateBookInput } from "../dto/update-book.input";

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepo: Repository<BookEntity>,
    ) {}

    async create(createBookInput: CreateBookInput): Promise<BookEntity> {
        const book = this.bookRepo.create(createBookInput);
        return this.bookRepo.save(book);
    }

    async findAll(): Promise<BookEntity[]> {
        return this.bookRepo.find();
    }

    async findOne(id: number): Promise<BookEntity> {
        const book = await this.bookRepo.findOne({ where: { id } });
        if (!book) throw new NotFoundException("Book not found");
        return book;
    }

    async update(id: number, updateBookInput: UpdateBookInput): Promise<BookEntity> {
        const book = await this.findOne(id);
        Object.assign(book, updateBookInput);
        return this.bookRepo.save(book);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.bookRepo.delete(id);
        return result.affected > 0;
    }
}
