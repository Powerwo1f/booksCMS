import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("AppController (e2e)", () => {
    let app: INestApplication;

    // Поднимаем приложение один раз для всех тестов
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
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
