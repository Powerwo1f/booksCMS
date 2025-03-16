import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            "permissions",
            [context.getHandler(), context.getClass()]
        );

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true; // Если пермишены не указаны, доступ открыт
        }

        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;

        if (!user) {
            return false; // нет пользователя ➜ нет доступа
        }

        const userPermissions = user.permissions || [];

        // Проверяем, есть ли у пользователя хотя бы одно из нужных прав
        return requiredPermissions.some((permission) =>
            userPermissions.includes(permission)
        );
    }
}
