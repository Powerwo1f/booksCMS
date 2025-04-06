import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ActivityLogService } from "../../activity-log/services/activity-log.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly activityLogService: ActivityLogService // ВАЖНО: добавляем сервис логов
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            "permissions",
            [context.getHandler(), context.getClass()]
        );

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true; // Если пермишены не указаны, доступ открыт
        }

        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        const user = req.user;

        // console.log("User making request:", user.userId);

        if (!user) {
            await this.activityLogService.logActivity({
                userId: "anonymous",
                action: "ACCESS_DENIED",
                entityType: "PERMISSION", // например, указываешь что логируется доступ по пермишенам
                status: "FORBIDDEN_NO_PERMISSION",
                executionTimeMs: 0, // если нет времени выполнения - укажи 0 или рассчитай
            });

            throw new ForbiddenException("No user attached to request");
        }

        const userPermissions = user.permissions || [];

        const hasPermission = requiredPermissions.some((permission) =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            await this.activityLogService.logActivity({
                userId: user.id,
                action: "ACCESS_DENIED",
                entityType: "PERMISSION", // например, указываешь что логируется доступ по пермишенам
                status: "FORBIDDEN_NO_PERMISSION",
                executionTimeMs: 0, // если нет времени выполнения - укажи 0 или рассчитай
            });

            throw new ForbiddenException("You do not have permission to access this resource");
        }

        // Можно залогировать успешный доступ, если нужно
        // await this.activityLogService.logActivity({
        //     userId: user.id,
        //     action: "ACCESS_GRANTED",
        //     entityType: "PERMISSION", // например, указываешь что логируется доступ по пермишенам
        //     status: "SUCCESS",
        //     executionTimeMs: 0, // если нет времени выполнения - укажи 0 или рассчитай
        // });

        return true;
    }
}
