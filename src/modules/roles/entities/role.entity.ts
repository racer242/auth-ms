import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { CrmUserEntity } from '../../crm-users/entities/crm-user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ unique: true, length: 50 })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  permissions: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToMany(() => CrmUserEntity, (user) => user.roles)
  users: CrmUserEntity[];
}
