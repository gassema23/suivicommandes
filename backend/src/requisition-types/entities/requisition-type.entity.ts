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
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {  IsOptional, IsString, MaxLength } from 'class-validator';

@Entity('requisition_types')
@Index(['requisitionTypeName'])
@Index(['deletedAt'])
export class RequisitionType {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'requisition_type_name', length: 125, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  requisitionTypeName?: string;

  @Column({ name: 'requisition_type_description', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  requisitionTypeDescription?: string;

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

}