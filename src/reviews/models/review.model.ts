import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Review {
    @Field()
    bookId: string;

    @Field()
    reviewId: string;

    @Field()
    userId: string;

    @Field(() => Int)
    rating: number;

    @Field({ nullable: true })
    comment?: string;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;

    @Field({ nullable: true })
    spoiler?: boolean;

    @Field(() => Int, { nullable: true })
    likes?: number;

    @Field({ nullable: true })
    moderationStatus?: string;
}
