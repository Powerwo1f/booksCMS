import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RolePermissionEntity } from "./role-permission.entity";
import { UserPermissionEntity } from "./user-permission.entity";

@Entity("permissions")
export class PermissionEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.permission)
    rolePermissions: RolePermissionEntity[];

    @OneToMany(() => UserPermissionEntity, userPermission => userPermission.permission)
    userPermissions: UserPermissionEntity[];
}
