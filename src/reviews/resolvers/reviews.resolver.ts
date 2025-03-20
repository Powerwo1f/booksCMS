import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ReviewsService } from "../services/reviews.service";
import { CreateReviewInput } from "../dto/create-review.input";
import { UpdateReviewInput } from "../dto/update-review.input";
import { Review } from "../models/review.model";
import { UseGuards } from "@nestjs/common";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard"; // если нужно
import { Permissions } from "../../common/decorators/permissions.decorator";

@Resolver(() => Review)
export class ReviewResolver {
    constructor(private readonly reviewService: ReviewsService) {}

    @Query(() => [Review], { name: "getReviewsByBook" })
    @UseGuards(GqlAuthGuard) // только авторизованные могут смотреть
    async getReviewsByBook(@Args("bookId", { type: () => String }) bookId: string) {
        return this.reviewService.findByBookId(bookId);
    }

    @Query(() => Review, { name: "getReviewById" })
    @UseGuards(GqlAuthGuard) // если нужна авторизация
    @Permissions("READ_REVIEW") // ✅ пермишен на создание
    async getReviewById(
        @Args("bookId", { type: () => String }) bookId: string,
        @Args("reviewId", { type: () => String }) reviewId: string
    ) {
        return this.reviewService.findById(bookId, reviewId);
    }

    @Mutation(() => Review)
    @UseGuards(GqlAuthGuard, PermissionsGuard)
    @Permissions("CREATE_REVIEW") // ✅ пермишен на создание
    async createReview(@Args("input") input: CreateReviewInput) {
        return this.reviewService.create(input);
    }

    @Mutation(() => Review)
    @UseGuards(GqlAuthGuard, PermissionsGuard)
    @Permissions("UPDATE_REVIEW") // ✅ пермишен на обновление
    async updateReview(@Args("input") input: UpdateReviewInput) {
        return this.reviewService.update(input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard, PermissionsGuard)
    @Permissions("DELETE_REVIEW") // ✅ пермишен на удаление
    async deleteReview(
        @Args("bookId", { type: () => String }) bookId: string,
        @Args("reviewId", { type: () => String }) reviewId: string
    ) {
        await this.reviewService.delete(bookId, reviewId);
        return true;
    }
}
