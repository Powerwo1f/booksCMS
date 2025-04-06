import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserPermissionEntity } from "../../entities/user-permission.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserRoleEntity } from "./user-role.entity";

@ObjectType()
@Entity("users")
export class UserEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    fullName: string;

    @Column()
    password: string;

    @OneToMany(() => UserRoleEntity, (userRole) => userRole.user, { cascade: true })
    roles: UserRoleEntity[];

    @OneToMany(() => UserPermissionEntity, (userPermission) => userPermission.user, { cascade: true })
    permissions: UserPermissionEntity[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
