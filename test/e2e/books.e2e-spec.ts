import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import * as fs from "fs";
import * as path from "path";
import { AuthHelper } from "../helpers/auth.helper";
import { createTestApp } from "./setup-2e2";
import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";

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

    describe("createBook and upload file", () => {
        let presignedUrl: string;
        const title = `Тестовая книга ${Date.now()}`;

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

            expect(response.body?.data?.createBook?.book?.title).toBe(title);

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

    });
});
