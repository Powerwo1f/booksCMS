import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { RoleEntity } from "./role.entity";
import { PermissionEntity } from "./permission.entity";

@Entity("role_permissions")
export class RolePermissionEntity {
    @PrimaryColumn()
    roleId: string;

    @PrimaryColumn()
    permissionId: string;

    @ManyToOne(() => RoleEntity, role => role.rolePermissions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "roleId" })
    role: RoleEntity;

    @ManyToOne(() => PermissionEntity, permission => permission.rolePermissions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "permissionId" })
    permission: PermissionEntity;
}
