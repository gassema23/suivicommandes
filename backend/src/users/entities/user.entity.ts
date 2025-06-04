import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  RelationId,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Team } from '../../teams/entities/team.entity';
import { Role } from 'src/roles/entities/role.entity';

@Entity('users')
@Index(['email'])
@Index(['firstName'])
@Index(['lastName'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'first_name' })
  @IsString()
  firstName: string;

  @Column({ name: 'last_name' })
  @IsString()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ name: 'profile_image', nullable: true })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  @IsOptional()
  emailVerifiedAt?: Date;

  @Column()
  @Exclude()
  @IsString()
  password: string;

  @Column({ name: 'two_factor_code', nullable: true })
  @Exclude()
  @IsOptional()
  @IsString()
  twoFactorCode?: string;

  @Column({ name: 'two_factor_expires_at', type: 'timestamp', nullable: true })
  @Exclude()
  @IsOptional()
  twoFactorExpiresAt?: Date;

  @Column({ name: 'two_factor_secret', nullable: true })
  @Exclude()
  @IsOptional()
  @IsString()
  twoFactorSecret?: string;

  @Column({ name: 'two_factor_enabled', default: false })
  @IsBoolean()
  twoFactorEnabled: boolean;

  @Column({ name: 'remember_token', nullable: true })
  @Exclude()
  @IsOptional()
  @IsString()
  rememberToken?: string;

  @ManyToOne(() => Team, (team) => team.users, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  @IsOptional()
  team?: Team;

  @ManyToOne(() => Role, { nullable: true, eager: true })
  @JoinColumn({ name: 'role_id' })
  @IsOptional()
  role?: Role;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  @IsOptional()
  createdBy?: Partial<User>;

  @RelationId((user: User) => user.createdBy)
  createdById?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  @IsOptional()
  updatedBy?: Partial<User>;

  @RelationId((user: User) => user.updatedBy)
  updatedById?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deleted_by' })
  @IsOptional()
  deletedBy?: Partial<User>;

  @RelationId((user: User) => user.deletedBy)
  deletedById?: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @IsOptional()
  readonly deletedAt?: Date;

  // Virtual properties
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }
}
