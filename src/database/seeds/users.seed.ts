import { DataSource } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import * as bcrypt from "bcrypt";
import { RoleEntity } from "../../entities/role.entity";
import { PermissionEntity } from "../../entities/permission.entity";

export const seedUsers = async (dataSource: DataSource, roles: RoleEntity[], permissions: PermissionEntity[]) => {
    const userRepo = dataSource.getRepository(UserEntity);

    const adminRole = roles.find(role => role.name === "ADMIN");
    const userRole = roles.find(role => role.name === "USER");

    const adminUser = userRepo.create({
        email: "admin@admin.com",
        password: await bcrypt.hash("adminpassword", 10),
        roles: [
            {
                userId: "", // заполняется автоматически или после save()
                roleId: adminRole.id,
                role: adminRole,
            },
        ],
        permissions: permissions.map(permission => ({
            userId: "", // заполняется автоматически или после save()
            permissionId: permission.id,
            permission: permission,
        })),
    });

    const user1 = userRepo.create({
        email: "user1@example.com",
        password: await bcrypt.hash("userpassword", 10),
        roles: [
            {
                userId: "",
                roleId: userRole.id,
                role: userRole,
            },
        ],
        permissions: [],
    });

    await userRepo.save([adminUser, user1]);
    console.log("✅ Users seeded!");
};
