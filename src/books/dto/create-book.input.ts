import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class CreateBookInput {
    @Field()
    title: string;

    @Field()
    author: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int, { description: "Year the book was published" })
    publicationYear: number;
}
