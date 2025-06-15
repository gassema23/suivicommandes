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
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';

@Entity('request_types')
@Index(['requestTypeName'])
@Index(['deletedAt'])
export class RequestType {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'request_type_name', length: 125, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  requestTypeName?: string;

  @Column({ name: 'request_type_description', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  requestTypeDescription?: string;

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
    () => RequestTypeServiceCategory,
    (rtServiceCategory) => rtServiceCategory.requestType,
  )
  requestTypeServiceCategories: RequestTypeServiceCategory[];
}
