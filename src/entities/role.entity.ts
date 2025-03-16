import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRoleEntity } from "../users/entities/user-role.entity";
import { RolePermissionEntity } from "./role-permission.entity";

@Entity("roles")
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => UserRoleEntity, userRole => userRole.role)
    userRoles: UserRoleEntity[];

    @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.role)
    rolePermissions: RolePermissionEntity[];
}
