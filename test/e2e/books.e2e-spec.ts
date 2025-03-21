import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { AuthHelper } from "../helpers/auth.helper";

describe("BooksResolver (e2e)", () => {
    let app: INestApplication;
    let authHelper: AuthHelper;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

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
