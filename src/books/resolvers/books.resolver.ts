import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { BooksService } from "../services/books.service";
import { BookEntity } from "../entities/book.entity";
import { CreateBookInput } from "../dto/create-book.input";
import { UpdateBookInput } from "../dto/update-book.input";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";
import { CreateBookResponse } from "../dto/create-book.response";
import { Review } from "../../reviews/models/review.model";
import { ReviewsService } from "../../reviews/services/reviews.service";

@Resolver(() => BookEntity)
export class BooksResolver {
    constructor(
        private readonly booksService: BooksService,
        private readonly reviewService: ReviewsService,
    ) {}

    @Query(() => [BookEntity], { name: "books" })
    @UseGuards(PermissionsGuard)
    @Permissions("READ_BOOK")
    findAll(): Promise<BookEntity[]> {
        return this.booksService.findAll();
    }

    @ResolveField(() => [Review])
    async reviews(@Parent() book: BookEntity) {
        return this.reviewService.findByBookId(book.id);
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
