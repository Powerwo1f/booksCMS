import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookEntity } from "../entities/book.entity";

@Injectable()
export class BookFileScannerService {
    private readonly logger = new Logger(BookFileScannerService.name);
    private s3 = new S3Client({
        region: "eu-north-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepo: Repository<BookEntity>
    ) {}

    @Cron("0 */1 * * * *") // каждую минуту
    async scanBooksFiles() {
        this.logger.log("Scanning S3 for book files...");

        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: "books/",
        });

        const result = await this.s3.send(command);
        if (!result.Contents) return;

        for (const item of result.Contents) {
            const key = item.Key;
            if (!key) continue;

            const match = key.match(/books\/([0-9a-fA-F-]{36})\.pdf/); // UUID
            if (!match) continue;

            const bookId = match[1];

            const existingBook = await this.bookRepo.findOneBy({ id: bookId });
            if (!existingBook) continue;

            if (existingBook.fileUrl) {
                this.logger.log(`Skipping bookId ${bookId} — fileUrl already exists`);
                continue;
            }

            const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            await this.bookRepo.update(bookId, { fileUrl });
            this.logger.log(`Updated fileUrl for bookId ${bookId}`);
        }
    }
}
