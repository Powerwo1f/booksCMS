import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class CreateReviewInput {
    @Field()
    bookId: string;

    @Field()
    userId: string;

    @Field(() => Int)
    rating: number;

    @Field({ nullable: true })
    comment?: string;

    @Field({ nullable: true })
    spoiler?: boolean;
}
