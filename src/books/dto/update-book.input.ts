import { CreateBookInput } from "./create-book.input";
import { InputType, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {}
