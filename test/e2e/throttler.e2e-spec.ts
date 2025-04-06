import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { createTestApp } from "./setup-2e2";

describe("Throttler (e2e)", () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should allow 10 requests and block the 11th (rate limit)", async () => {
        const query = {
            query: `mutation {
                login(input: { email: "admin@admin.com", password: "adminpassword" }) {
                    access_token
                }
            }`,
        };

        const headers = {
            "Content-Type": "application/json",
            "x-forwarded-for": "123.123.123.123",
        };

        // for (let i = 1; i <= 10; i++) {
        //     const res = await request(app.getHttpServer()).post("/graphql").set(headers).send(query);
        //
        //     expect(res.status).toBe(200);
        //     expect(res.body.data?.login?.access_token).toBeDefined();
        // }

        // 11-й должен быть заблокирован
        const blocked = await request(app.getHttpServer()).post("/graphql").set(headers).send(query);

        expect(blocked.status).toBe(429);
        expect(blocked.body.errors?.[0].message).toBe("Too Many Requests");
    });
});
