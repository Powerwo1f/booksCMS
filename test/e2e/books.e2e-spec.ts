import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthHelper } from "../helpers/auth.helper";
import { createTestApp } from "./setup-2e2";

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

    it("should create a book", async () => {
        const title = `Тестовая книга ${Date.now()}`;
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
                        author
                        description
                        publicationYear
                    }
                    presignedUrl
                }
            }
    `;

        const response = await request(app.getHttpServer())
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`) // <-- Тут подставляем токен
            .send({ query: mutation });

        expect(response.body?.data?.createBook?.book?.title).toBe(title);
    });
});
