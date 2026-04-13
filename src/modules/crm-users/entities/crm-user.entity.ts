import { Entity, Column, ManyToMany, JoinTable, ManyToOne, Index } from 'typeorm';
import { BaseUserEntity } from '../../users/entities/base-user.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('crm_users')
export class CrmUserEntity extends BaseUserEntity {
  @Column({ unique: true, length: 100 })
  @Index()
  username: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ nullable: true, name: 'blocked_by', type: 'uuid' })
  blockedBy: string | null;

  @ManyToMany(() => RoleEntity, { cascade: true })
  @JoinTable({
    name: 'crm_user_roles',
    joinColumn: { name: 'crm_user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: RoleEntity[];
}
