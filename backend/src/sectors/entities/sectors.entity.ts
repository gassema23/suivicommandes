import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Service } from '../../services/entities/service.entity';

@Entity('sectors')
@Index(['sectorName'])
@Index(['deletedAt'])
export class Sector {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'sector_name', length: 125, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  sectorName?: string;

  @Column({
    name: 'sector_client_time_end',
    type: 'time',
    nullable: true,
    default: '00:00',
  })
  @IsOptional()
  @IsString()
  sectorClientTimeEnd?: string;

  @Column({
    name: 'sector_provider_time_end',
    type: 'time',
    nullable: true,
    default: '00:00',
  })
  @IsOptional()
  @IsString()
  sectorProviderTimeEnd?: string;

  @Column({ name: 'is_auto_calculate', type: 'boolean', default: false })
  @IsOptional()
  isAutoCalculate?: boolean;

  @Column({ name: 'is_conformity', type: 'boolean', default: false })
  @IsOptional()
  isConformity?: boolean;

  @Column({ name: 'sector_description', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  sectorDescription?: string;

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

  @OneToMany(() => Service, (service) => service.sector)
  services: Service[];
}
