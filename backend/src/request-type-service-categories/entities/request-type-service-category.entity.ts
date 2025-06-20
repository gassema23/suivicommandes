import { IsOptional } from 'class-validator';
import { RequestType } from '../../request-types/entities/request-type.entity';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { RequestTypeDelay } from '../../request-type-delays/entities/request-type-delay.entity';
import { DeliverableDelayRequestType } from '@/deliverable-delay-request-types/entities/deliverable-delay-request-type.entity';

@Entity('request_type_service_categories')
@Unique(['serviceCategory', 'requestType'])
export class RequestTypeServiceCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceCategory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_category_id' })
  serviceCategory: ServiceCategory;

  @ManyToOne(() => RequestType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_type_id' })
  requestType: RequestType;

  @Column({ name: 'availability_delay', type: 'int', default: 0 })
  availabilityDelay: number;

  @Column({ name: 'minimum_required_delay', type: 'int', default: 0 })
  minimumRequiredDelay: number;

  @Column({ name: 'service_activation_delay', type: 'int', default: 0 })
  serviceActivationDelay: number;

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
    () => RequestTypeDelay,
    (requestTypeDelay) => requestTypeDelay.delayType,
  )
  requestTypeDelays: RequestTypeDelay[];

  @OneToMany(
    () => DeliverableDelayRequestType,
    (ddrt) => ddrt.requestTypeServiceCategory,
  )
  deliverableDelayRequestTypes: DeliverableDelayRequestType[];
}
