import { DataSource } from "typeorm";
import { PermissionEntity } from "../../entities/permission.entity";

export const seedPermissions = async (dataSource: DataSource) => {
    const permissionRepo = dataSource.getRepository(PermissionEntity);

    const permissions = permissionRepo.create([
        { name: "CREATE_USER" },
        { name: "DELETE_USER" },
        { name: "UPDATE_USER" },
    ]);

    await permissionRepo.save(permissions);
    console.log("✅ Permissions seeded!");

    return permissions;
};
