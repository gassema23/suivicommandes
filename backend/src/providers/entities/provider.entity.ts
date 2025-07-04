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
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ProviderServiceCategory } from '../../provider-service-categories/entities/provider-service-category.entity';
import { Expose } from 'class-transformer';

@Entity('providers')
@Index(['providerName', 'providerCode'])
@Index(['deletedAt'])
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'provider_name', length: 125, nullable: false })
  @IsString()
  @MaxLength(125)
  providerName: string;

  @Column({ name: 'provider_code', length: 50, nullable: false, default: '0' })
  @IsString()
  @MaxLength(50)
  providerCode: string;

  // Relation vers l'utilisateur ayant créé l'équipe
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  @IsOptional()
  createdBy?: Partial<User>;

  // Relation vers l'utilisateur ayant mis à jour l'équipe
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  @IsOptional()
  updatedBy?: Partial<User>;

  // Relation vers l'utilisateur ayant supprimé l'équipe
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deleted_by' })
  @IsOptional()
  deletedBy?: Partial<User>;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @IsOptional()
  readonly deletedAt?: Date;

  @OneToMany(
    () => ProviderServiceCategory,
    (providerServiceCategory) => providerServiceCategory.provider,
  )
  providerServiceCategories: ProviderServiceCategory[];

  // Virtual properties
  @Expose()
  get virtualProviderName(): string {
    if (this.providerName && this.providerCode) {
      return `${this.providerName} (${this.providerCode})`;
    }
    if (this.providerName) {
      return this.providerName;
    }
    if (this.providerCode) {
      return this.providerCode;
    }
    return '';
  }
}
