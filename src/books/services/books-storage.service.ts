import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BooksStorageService {
    private s3 = new S3Client({
        region: "eu-north-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    async generateUploadUrl(bookId: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `books/${bookId}.pdf`,
            ContentType: "application/pdf",
        });

        return getSignedUrl(this.s3, command, { expiresIn: 3600 });
    }
}
