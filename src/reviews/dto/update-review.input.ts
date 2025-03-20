import { InputType, Field, Int, PartialType, ID } from "@nestjs/graphql";
import { CreateReviewInput } from "./create-review.input";

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
    @Field(() => ID)
    reviewId: string; // обязательно указываем, какой именно отзыв обновляем
}
