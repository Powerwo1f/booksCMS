import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Review } from "../../reviews/models/review.model";

@ObjectType()
@Entity("books")
export class BookEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({ unique: true })
    title: string;

    @Field()
    @Column()
    author: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description?: string;

    @Field(() => Int, { description: "Year the book was published" })
    @Column()
    publicationYear: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    fileUrl?: string; // Presigned URL or path to S3 file

    @Field(() => [Review], { nullable: true })
    reviews?: Review[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
