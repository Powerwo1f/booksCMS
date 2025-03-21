import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") {
    // Гарантируем что Passport сможет получить req
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const resolverName = context.getHandler().name;

        // Пропустить login и register
        if (resolverName === "login" || resolverName === "register") {
            return true;
        }

        return super.canActivate(context) as Promise<boolean>;
    }
}
