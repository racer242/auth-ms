import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export abstract class BaseUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  @Index()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ default: false, name: 'is_blocked' })
  @Index()
  isBlocked: boolean;

  @Column({ nullable: true, name: 'blocked_at', type: 'timestamptz' })
  blockedAt: Date | null;

  @Column({ nullable: true, name: 'blocked_reason', type: 'text' })
  blockedReason: string | null;

  @Column({ nullable: true, name: 'last_login_at', type: 'timestamptz' })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
