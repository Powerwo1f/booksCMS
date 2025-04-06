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
        const mutation = `
            mutation {
                createBook(input: {
                    title: "Тестовая книга",
                    author: "Автор",
                    description: "Описание",
                    publicationYear: 2024
                }) {
                    id
                    title
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`) // <-- Тут подставляем токен
            .send({ query: mutation });

        console.log(response.body);

        expect(response.body.data.createBook.title).toBe("Тестовая книга");
    });
});
