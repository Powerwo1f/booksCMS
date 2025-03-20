import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { ActivityLogService } from "../services/activity-log.service";
import { v4 as uuid } from "uuid";

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
    constructor(private readonly activityLogService: ActivityLogService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const ctx = context.switchToHttp(); // если HTTP
        const gqlCtx = context.getArgByIndex(2); // если GraphQL

        const request = ctx.getRequest ? ctx.getRequest() : gqlCtx?.req;

        const user = request?.user || { id: "anonymous" };
        const ip = request?.ip || "unknown";
        const userAgent = request?.headers?.["user-agent"] || "unknown";

        const correlationId = uuid();

        return next.handle().pipe(
            tap(async (response) => {
                const handler = context.getHandler().name;
                const className = context.getClass().name;

                await this.activityLogService.logActivity({
                    userId: user.id,
                    action: handler,
                    entityType: className,
                    status: "success",
                    executionTimeMs: Date.now() - now,
                    ip,
                    userAgent,
                    correlationId,
                    requestData: request?.body || {},
                });
            }),
        );
    }
}
