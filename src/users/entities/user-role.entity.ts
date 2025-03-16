import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from '../../entities/role.entity';

@Entity('user_roles')
export class UserRoleEntity {
    @PrimaryColumn('uuid')
    userId: string;

    @PrimaryColumn('uuid')
    roleId: string;

    @ManyToOne(() => UserEntity, (user) => user.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => RoleEntity, (role) => role.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roleId' })
    role: RoleEntity;
}
