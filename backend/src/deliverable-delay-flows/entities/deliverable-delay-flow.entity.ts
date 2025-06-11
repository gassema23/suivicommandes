import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsOptional } from 'class-validator';
import { Flow } from '../../flows/entities/flow.entity';
import { DeliverableDelayRequestType } from '../../deliverable-delay-request-types/entities/deliverable-delay-request-type.entity';

@Entity('deliverable_delay_flows')
@Index(['deletedAt'])
export class DeliverableDelayFlow {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(
    () => DeliverableDelayRequestType,
    (deliverableDelayRequestType) =>
      deliverableDelayRequestType.deliverableDelayFlows,
    { nullable: false },
  )
  @JoinColumn({ name: 'deliverable_delay_request_type_id' })
  requestTypeServiceCategory: DeliverableDelayRequestType;

  @ManyToOne(() => Flow, (flow) => flow.deliverableDelayFlows, {
    nullable: false,
  })
  @JoinColumn({ name: 'flow_id' })
  deliverable: Flow;

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
