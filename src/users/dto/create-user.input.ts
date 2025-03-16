import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, MinLength } from "class-validator";

@InputType()
export class CreateUserInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @MinLength(6)
    password: string;

    @Field({ nullable: true })
    fullName?: string;
}
