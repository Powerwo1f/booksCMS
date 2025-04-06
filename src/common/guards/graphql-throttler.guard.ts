import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";
import { GraphQLError } from "graphql/error";

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    protected getRequestResponse(context: ExecutionContext): { req: any; res: any } {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext()?.req;
        const response = ctx.getContext()?.res;

        if (request && !request.header) {
            request.header = (name: string) => request.headers?.[name.toLowerCase()];
        }

        return { req: request, res: response };
    }

    protected async getTracker(req: Record<string, any>): Promise<string> {
        const ip =
            req.headers?.["x-forwarded-for"]?.split(",")[0].trim() ||
            req.ip ||
            req.socket?.remoteAddress ||
            "anonymous";

        console.log("Throttler IP =>", ip);
        return ip;
    }

    protected throwThrottlingException(): never {
        throw new GraphQLError("Too Many Requests", {
            extensions: {
                code: "TOO_MANY_REQUESTS",
                http: { status: 429 },
            },
        });
    }
}
