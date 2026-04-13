import { Entity, Column, Index } from 'typeorm';
import { BaseUserEntity } from '../../users/entities/base-user.entity';

@Entity('portal_users')
export class PortalUserEntity extends BaseUserEntity {
  @Column({ nullable: true, unique: true, length: 20 })
  @Index({ where: 'phone IS NOT NULL' })
  phone: string;

  @Column({ name: 'first_name', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'middle_name', length: 100, nullable: true })
  middleName: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true, length: 10 })
  gender: string;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ length: 10, default: 'ru' })
  locale: string;

  @Column({ length: 50, default: 'Europe/Moscow' })
  timezone: string;

  @Column({ default: false, name: 'email_verified' })
  @Index()
  emailVerified: boolean;

  @Column({ default: false, name: 'phone_verified' })
  phoneVerified: boolean;

  @Column({ nullable: true, name: 'email_verified_at', type: 'timestamptz' })
  emailVerifiedAt: Date | null;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;
}
