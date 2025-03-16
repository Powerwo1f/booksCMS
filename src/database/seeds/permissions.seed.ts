import { DataSource } from "typeorm";
import { PermissionEntity } from "../../entities/permission.entity";

export const seedPermissions = async (dataSource: DataSource): Promise<PermissionEntity[]> => {
    const permissionRepo = dataSource.getRepository(PermissionEntity);

    await permissionRepo.query(`TRUNCATE TABLE "role_permissions" CASCADE`);
    await permissionRepo.query(`TRUNCATE TABLE "user_permissions" CASCADE`);
    await permissionRepo.query(`TRUNCATE TABLE "permissions" CASCADE`);

    const permissions = [
        { name: "CREATE_USER" },
        { name: "DELETE_USER" },
        { name: "UPDATE_USER" },
        { name: "READ_USER" },
        { name: "MANAGE_ROLES" },
        { name: "CREATE_BOOK" },
        { name: "DELETE_BOOK" },
        { name: "UPDATE_BOOK" },
        { name: "READ_BOOK" },
        { name: "MANAGE_PERMISSIONS" },
    ];

    for (const permission of permissions) {
        const exists = await permissionRepo.findOneBy({ name: permission.name });
        if (!exists) {
            await permissionRepo.save(permission);
        }
    }

    const allPermissions = await permissionRepo.find();
    console.log("✅ Permissions seeded successfully!");

    return allPermissions;
};
