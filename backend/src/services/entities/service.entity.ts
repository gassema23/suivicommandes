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
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Sector } from 'src/sectors/entities/sectors.entity';
import { ServiceCategory } from 'src/service-categories/entities/service-category.entity';

@Entity('services')
@Index(['serviceName'])
@Index(['deletedAt'])
export class Service {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'sector_id', nullable: false })
  @IsUUID()
  sectorId?: string;

  @ManyToOne(() => Sector, (sector) => sector.services, { nullable: false })
  @JoinColumn({ name: 'sector_id' })
  @IsOptional()
  sector: Sector;

  @Column({ name: 'service_name', length: 125, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  serviceName?: string;

  @Column({ name: 'service_description', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  serviceDescription?: string;

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


    @OneToMany(() => ServiceCategory, (serviceCategory) => serviceCategory.service)
    serviceCategories?: ServiceCategory[];
}
