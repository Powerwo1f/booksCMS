import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { createTestApp } from "./e2e/setup-2e2";

describe("AppController (e2e)", () => {
    let app: INestApplication;

    // Поднимаем приложение один раз для всех тестов
    beforeAll(async () => {
        app = await createTestApp();
    });

    // Закрываем приложение после всех тестов
    afterAll(async () => {
        await app.close();
    });

    it("/ (GET)", () => {
        return request(app.getHttpServer()).get("/").expect(404);
        // return request(app.getHttpServer()).get("/").expect(200).expect("Hello World!");
    });

    // Добавляй дальше тесты сюда...
});
