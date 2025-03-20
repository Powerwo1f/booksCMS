import { Injectable, Logger } from "@nestjs/common";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";

@Injectable()
export class ActivityLogService {
    private readonly logger = new Logger(ActivityLogService.name);
    private readonly docClient: DynamoDBDocumentClient;

    constructor() {
        const client = new DynamoDBClient({
            region: "local",
            endpoint: "http://localhost:8000", // если работаешь локально
            credentials: {
                accessKeyId: "fakeMyKeyId",
                secretAccessKey: "fakeSecretAccessKey",
            },
        });

        this.docClient = DynamoDBDocumentClient.from(client);
    }

    async logActivity(log: {
        userId: string;
        action: string;
        entityType: string;
        entityId?: string;
        status: string;
        executionTimeMs: number;
        ip?: string;
        userAgent?: string;
        correlationId?: string;
        changes?: Record<string, any>;
        requestData?: Record<string, any>;
    }) {
        const item = {
            activityId: uuid(),
            ...log,
            timestamp: new Date().toISOString(),
        };

        try {
            await this.docClient.send(
                new PutCommand({
                    TableName: "UserActivityLogs", // имя твоей таблицы
                    Item: item,
                }),
            );
            this.logger.log(`✅ Activity logged: ${item.activityId}`);
        } catch (error) {
            this.logger.error(`❌ Failed to log activity: ${error.message}`);
        }
    }
}
