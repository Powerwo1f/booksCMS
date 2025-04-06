import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import * as fs from "fs";
import * as path from "path";
import { AuthHelper } from "../helpers/auth.helper";
import { createTestApp } from "./setup-2e2";
import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { plainToInstance } from "class-transformer";
import { BookEntity } from "../../src/books/entities/book.entity";
import { validateSync } from "class-validator";

describe("BooksResolver (e2e)", () => {
    let app: INestApplication;
    let authHelper: AuthHelper;
    let token: string;

    beforeAll(async () => {
        app = await createTestApp();

        authHelper = new AuthHelper(app);
        token = await authHelper.login();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("Books operations", () => {
        let presignedUrl: string;
        const title = `Тестовая книга ${Date.now()}`;
        let createdBookId: string;

        it("should create a book and return presignedUrl", async () => {
            const mutation = `
                mutation {
                    createBook(input: {
                        title: "${title}",
                        author: "Автор",
                        description: "Описание",
                        publicationYear: 2024
                    }) {
                        book {
                            id
                            title
                            description
                            publicationYear                        
                        }
                        presignedUrl
                    }
                }
            `;

            const response = await request(app.getHttpServer())
                .post("/graphql")
                .set("Authorization", `Bearer ${token}`)
                .send({ query: mutation });

            const book = response.body?.data?.createBook?.book;
            createdBookId = book.id;

            expect(book?.title).toBe(title);

            presignedUrl = response.body?.data?.createBook?.presignedUrl;
            expect(presignedUrl).toBeDefined();
        });

        it("should upload a file using presignedUrl", async () => {
            const pdfBuffer = fs.readFileSync(path.resolve(__dirname, "../fixtures/whale_evolution.pdf"));

            const uploadResponse = await request(presignedUrl)
                .put("")
                .set("Content-Type", "application/pdf")
                .send(pdfBuffer);

            expect(uploadResponse.statusCode).toBe(200);

            // Проверка файла в S3
            const s3 = new S3Client({
                region: process.env.AWS_REGION!,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                },
            });

            const uploadedKey = new URL(presignedUrl).pathname.slice(1); // Убираем ведущий слеш

            const headCommand = new HeadObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: uploadedKey,
            });

            const s3Response = await s3.send(headCommand);
            expect(s3Response.$metadata.httpStatusCode).toBe(200);
        });

        it("should return all books", async () => {
            const query = `
                query {
                    books {
                        id
                        title
                        author
                        description 
                        publicationYear
                    }
                }
            `;

            const response = await request(app.getHttpServer())
                .post("/graphql")
                .set("Authorization", `Bearer ${token}`)
                .send({ query });

            const books = response.body?.data?.books;
            expect(Array.isArray(books)).toBe(true);

            for (const rawBook of books) {
                const instance = plainToInstance(BookEntity, rawBook);
                const errors = validateSync(instance);
                expect(errors).toHaveLength(0);
            }
        });

        it("should return a single book", async () => {
            const query = `
                query {
                    book(id: "${createdBookId}") {
                        id
                        title
                        author
                        description 
                        publicationYear
                    }
                }
            `;

            const response = await request(app.getHttpServer())
                .post("/graphql")
                .set("Authorization", `Bearer ${token}`)
                .send({ query });

            expect(response.body?.data?.book?.id).toBe(createdBookId);
        });

        it("should update a book", async () => {
            const newTitle = `Updated Title ${Date.now()}`;
            const mutation = `
                mutation {
                    updateBook(id: "${createdBookId}", input: {
                        title: "${newTitle}"
                    }) {
                        id
                        title
                        author
                        description 
                        publicationYear
                    }
                }
            `;

            const response = await request(app.getHttpServer())
                .post("/graphql")
                .set("Authorization", `Bearer ${token}`)
                .send({ query: mutation });

            expect(response.body?.data?.updateBook?.title).toBe(newTitle);
        });

        it("should delete a book", async () => {
            const mutation = `
            mutation {
                deleteBook(id: "${createdBookId}")
            }
        `;

            const response = await request(app.getHttpServer())
                .post("/graphql")
                .set("Authorization", `Bearer ${token}`)
                .send({ query: mutation });

            expect(response.body?.data?.deleteBook).toBe(true);
        });
    });
});
