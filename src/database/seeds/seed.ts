import { AppDataSource } from "../../config/typeorm.datasource";
import { seedRoles } from "./roles.seed";
import { seedPermissions } from "./permissions.seed";
import { seedUsers } from "./users.seed";

(async () => {
    const dataSource = await AppDataSource.initialize();

    try {
        const roles = await seedRoles(dataSource);
        const permissions = await seedPermissions(dataSource);
        await seedUsers(dataSource, roles, permissions);

        console.log("🎉 Full seed completed!");
    } catch (err) {
        console.error("❌ Seed failed", err);
    } finally {
        await dataSource.destroy();
    }
})();
