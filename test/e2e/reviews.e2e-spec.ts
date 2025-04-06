import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthHelper } from "../helpers/auth.helper";
import { createTestApp } from "./setup-2e2";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { Review } from "../../src/reviews/models/review.model";

describe("Reviews CRUD", () => {
    let bookId: string;
    let reviewId: string;
    let app: INestApplication;
    let authHelper: AuthHelper;
    let token: string;

    beforeAll(async () => {
        app = await createTestApp();

        authHelper = new AuthHelper(app);
        token = await authHelper.login();

        const title = `Книга для отзывов ${Date.now()}`;
        const mutation = `
            mutation {
                createBook(input: {
                    title: "${title}",
                    author: "Автор",
                    description: "Описание",
                    publicationYear: 2024
                }) {
                    book { id }
                    presignedUrl
                }
            }
        `;
        const res = await request(app.getHttpServer())
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({ query: mutation });

        bookId = res.body.data.createBook.book.id;
    });

    it("should create a review", async () => {
        const mutation = `
            mutation {
                createReview(input: {
                    bookId: "${bookId}",
                    comment: "Хорошая книга",
                    rating: 5,
                    userId: "test-user"
                }) {
                    bookId
                    userId
                    reviewId
                    rating
                    comment
                }
            }
        `;
        const res = await request(app.getHttpServer())
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({ query: mutation });

        console.log(res.body);

        expect(res.body.data.createReview.bookId).toBe(bookId);
        reviewId = res.body.data.createReview.reviewId;
    });

    it("should return all reviews by book", async () => {
        const query = `
            query {
                reviews(bookId: "${bookId}") {
                    bookId
                    reviewId
                    comment
                    userId
                    rating
                }
            }
        `;
        const res = await request(app.getHttpServer())
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({ query });

        console.log(res.body);

        const reviews = res.body.data.reviews;

        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews[0].bookId).toBe(bookId);

        for (const review of reviews) {
            const instance = plainToInstance(Review, review);
            const errors = validateSync(instance);
            expect(errors).toHaveLength(0);
        }
    });

    it("should update review", async () => {
        const mutation = `
            mutation {
                updateReview(input: {
                    bookId: "${bookId}",
                    reviewId: "${reviewId}",
                    comment: "Обновлённый отзыв"
                }) {
                    reviewId
                    comment
                }
            }
        `;
        const res = await request(app.getHttpServer())
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({ query: mutation });

        expect(res.body.data.updateReview.reviewId).toBe(reviewId);
        expect(res.body.data.updateReview.comment).toBe("Обновлённый отзыв");
    });

    it("should delete review", async () => {
        const mutation = `
            mutation {
                deleteReview(bookId: "${bookId}", reviewId: "${reviewId}")
            }
        `;
        const res = await request(app.getHttpServer())
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({ query: mutation });

        expect(res.body.data.deleteReview).toBe(true);
    });
});
