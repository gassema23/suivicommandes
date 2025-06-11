import {
  Entity,
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
import { IsOptional } from 'class-validator';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { Deliverable } from '../../deliverables/entities/deliverable.entity';
import { DeliverableDelayFlow } from 'src/deliverable-delay-flows/entities/deliverable-delay-flow.entity';

@Entity('deliverable_delay_request_types')
@Index(['deletedAt'])
export class DeliverableDelayRequestType {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(
    () => RequestTypeServiceCategory,
    (requestTypeServiceCategory) =>
      requestTypeServiceCategory.requestTypeDelays,
    { nullable: false },
  )
  @JoinColumn({ name: 'request_type_service_category_id' })
  requestTypeServiceCategory: RequestTypeServiceCategory;

  @ManyToOne(
    () => Deliverable,
    (deliverable) => deliverable.requestTypeDelays,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'deliverable_id' })
  deliverable: Deliverable;

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
    () => DeliverableDelayFlow,
    (flow) => flow.requestTypeServiceCategory,
  )
  deliverableDelayFlows: DeliverableDelayFlow[];
}
