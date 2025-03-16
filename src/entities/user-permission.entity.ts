import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { PermissionEntity } from "./permission.entity";

@Entity("user_permissions")
export class UserPermissionEntity {
    @PrimaryColumn("uuid")
    userId: string;

    @PrimaryColumn("uuid")
    permissionId: string;

    @ManyToOne(() => UserEntity, user => user.permissions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @ManyToOne(() => PermissionEntity, permission => permission.userPermissions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "permissionId" })
    permission: PermissionEntity;
}
