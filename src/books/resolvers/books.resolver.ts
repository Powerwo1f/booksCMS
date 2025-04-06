import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BooksService } from "../services/books.service";
import { BookEntity } from "../entities/book.entity";
import { CreateBookInput } from "../dto/create-book.input";
import { UpdateBookInput } from "../dto/update-book.input";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";
import { CreateBookResponse } from "../dto/create-book.response";

@Resolver(() => BookEntity)
export class BooksResolver {
    constructor(private readonly booksService: BooksService) {}

    @Query(() => [BookEntity], { name: "books" })
    @UseGuards(PermissionsGuard)
    @Permissions("READ_BOOK")
    findAll(): Promise<BookEntity[]> {
        return this.booksService.findAll();
    }

    @Query(() => BookEntity, { name: "book" })
    @UseGuards(PermissionsGuard)
    @Permissions("READ_BOOK")
    findOne(@Args("id") id: string): Promise<BookEntity> {
        return this.booksService.findOne(id);
    }

    @Mutation(() => CreateBookResponse, { name: "createBook" })
    @UseGuards(PermissionsGuard)
    @Permissions("CREATE_BOOK")
    create(@Args("input") input: CreateBookInput): Promise<CreateBookResponse> {
        return this.booksService.create(input);
    }

    @Mutation(() => BookEntity, { name: "updateBook" })
    @UseGuards(PermissionsGuard)
    @Permissions("UPDATE_BOOK")
    update(@Args("id") id: string, @Args("input") input: UpdateBookInput): Promise<BookEntity> {
        return this.booksService.update(id, input);
    }

    @Mutation(() => Boolean, { name: "deleteBook" })
    @UseGuards(PermissionsGuard)
    @Permissions("DELETE_BOOK")
    remove(@Args("id") id: string): Promise<boolean> {
        return this.booksService.remove(id);
    }
}
