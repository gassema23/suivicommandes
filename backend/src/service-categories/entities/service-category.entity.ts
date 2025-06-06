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
import { Service } from '../../services/entities/service.entity';
import { ProviderServiceCategory } from '../../provider-service-categories/entities/provider-service-category.entity';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';

@Entity('service_categories')
@Index(['serviceCategoryName'])
@Index(['deletedAt'])
export class ServiceCategory {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => Service, (service) => service.serviceCategories, {
    nullable: false,
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'service_category_name', length: 125, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  serviceCategoryName?: string;

  @Column({ name: 'is_multi_link', type: 'boolean', default: false })
  @IsOptional()
  isMultiLink?: boolean;

  @Column({ name: 'is_multi_provider', type: 'boolean', default: false })
  @IsOptional()
  isMultiProvider?: boolean;

  @Column({ name: 'is_required_expertise', type: 'boolean', default: false })
  @IsOptional()
  isRequiredExpertise?: boolean;

  @Column({ name: 'service_category_description', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  serviceCategoryDescription?: string;

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
    (providerServiceCategory) => providerServiceCategory.serviceCategory,
  )
  providerServiceCategories: ProviderServiceCategory[];

  @OneToMany(
    () => RequestTypeServiceCategory,
    (rtServiceCategory) => rtServiceCategory.serviceCategory,
  )
  requestTypeServiceCategories: RequestTypeServiceCategory[];
}
