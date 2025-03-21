// test/helpers/auth.helper.ts
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";

export class AuthHelper {
    constructor(private app: INestApplication) {}

    async login(email = "admin@admin.com", password = "adminpassword") {
        const response = await request(this.app.getHttpServer())
            .post("/graphql")
            .send({
                query: `
                    mutation {
                        login(input: { email: "${email}", password: "${password}" }) {
                            access_token
                        }
                    }
                `,
            });

        const token = response.body.data?.login?.access_token;
        // console.log(JSON.stringify(response.body, null, 2));

        if (!token) {
            throw new Error("No token received from login!");
        }

        return token;
    }
}
