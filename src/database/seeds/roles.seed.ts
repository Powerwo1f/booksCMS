import { DataSource } from "typeorm";
import { RoleEntity } from "../../entities/role.entity";

export const seedRoles = async (dataSource: DataSource) => {
    const roleRepo = dataSource.getRepository(RoleEntity);

    await roleRepo.query(`TRUNCATE TABLE "role_permissions" CASCADE`);
    await roleRepo.query(`TRUNCATE TABLE "user_roles" CASCADE`);
    await roleRepo.query(`TRUNCATE TABLE "roles" CASCADE`);

    const roles = roleRepo.create([
        { name: "ADMIN" },
        { name: "USER" },
    ]);

    await roleRepo.save(roles);
    console.log("✅ Roles seeded!");

    return roles;
};
