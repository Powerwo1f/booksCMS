import { Field, ObjectType } from "@nestjs/graphql";
import { BookEntity } from "../entities/book.entity";

@ObjectType()
export class CreateBookResponse {
    @Field(() => BookEntity)
    book: BookEntity;

    @Field()
    presignedUrl: string;
}