import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BooksService } from "../services/books.service";
import { BookEntity } from "../entities/book.entity";
import { CreateBookInput } from "../dto/create-book.input";
import { UpdateBookInput } from "../dto/update-book.input";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";

@Resolver(() => BookEntity)
export class BooksResolver {
    constructor(private readonly booksService: BooksService) {}

    @Query(() => [BookEntity], { name: "getAllBooks" })
    @UseGuards(PermissionsGuard)
    @Permissions("VIEW_BOOKS")
    findAll(): Promise<BookEntity[]> {
        return this.booksService.findAll();
    }

    @Query(() => BookEntity, { name: "getBookById" })
    @UseGuards(PermissionsGuard)
    @Permissions("VIEW_BOOKS")
    findOne(@Args("id") id: number): Promise<BookEntity> {
        return this.booksService.findOne(id);
    }

    @Mutation(() => BookEntity, { name: "createBook" })
    @UseGuards(PermissionsGuard)
    @Permissions("CREATE_BOOK")
    create(@Args("input") input: CreateBookInput): Promise<BookEntity> {
        return this.booksService.create(input);
    }

    @Mutation(() => BookEntity, { name: "updateBook" })
    @UseGuards(PermissionsGuard)
    @Permissions("UPDATE_BOOK")
    update(@Args("id") id: number, @Args("input") input: UpdateBookInput): Promise<BookEntity> {
        return this.booksService.update(id, input);
    }

    @Mutation(() => Boolean, { name: "deleteBook" })
    @UseGuards(PermissionsGuard)
    @Permissions("DELETE_BOOK")
    remove(@Args("id") id: number): Promise<boolean> {
        return this.booksService.remove(id);
    }
}
