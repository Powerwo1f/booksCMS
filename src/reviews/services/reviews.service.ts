import { Injectable, NotFoundException } from "@nestjs/common";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    QueryCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";
import { CreateReviewInput } from "../dto/create-review.input";
import { UpdateReviewInput } from "../dto/update-review.input";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ReviewsService {
    private readonly tableName = "Book_Reviews";
    private readonly docClient: DynamoDBDocumentClient;

    constructor() {
        const client = new DynamoDBClient({
            region: "local",
            endpoint: "http://localhost:8000" // Убедись, что совпадает с твоим Dynamo локальным URL
        });
        this.docClient = DynamoDBDocumentClient.from(client);
    }

    async findByBookId(bookId: string) {
        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "bookId = :bookId",
            ExpressionAttributeValues: {
                ":bookId": bookId
            }
        });

        const result = await this.docClient.send(command);
        return result.Items || [];
    }

    async findById(bookId: string, reviewId: string) {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { bookId, reviewId }
        });

        const result = await this.docClient.send(command);
        if (!result.Item) {
            throw new NotFoundException("Review not found");
        }

        return result.Item;
    }

    async create(input: CreateReviewInput) {
        const reviewId = uuidv4();
        const newReview = {
            ...input,
            reviewId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const command = new PutCommand({
            TableName: this.tableName,
            Item: newReview
        });

        await this.docClient.send(command);

        return newReview;
    }

    async update(input: UpdateReviewInput) {
        const { bookId, reviewId, ...updateData } = input;
        const now = new Date().toISOString();

        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined) {
                updateExpression.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = value;
            }
        }

        // всегда обновляем updatedAt
        updateExpression.push("#updatedAt = :updatedAt");
        expressionAttributeNames["#updatedAt"] = "updatedAt";
        expressionAttributeValues[":updatedAt"] = now;

        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: { bookId, reviewId },
            UpdateExpression: `SET ${updateExpression.join(", ")}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW"
        });

        const result = await this.docClient.send(command);
        return result.Attributes;
    }

    async delete(bookId: string, reviewId: string) {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: { bookId, reviewId }
        });

        await this.docClient.send(command);
    }
}
