import { DataSource } from "typeorm";
import { RoleEntity } from "../../entities/role.entity";

export const seedRoles = async (dataSource: DataSource) => {
    const roleRepo = dataSource.getRepository(RoleEntity);

    const roles = roleRepo.create([
        { name: "ADMIN" },
        { name: "USER" },
    ]);

    await roleRepo.save(roles);
    console.log("✅ Roles seeded!");

    return roles;
};
