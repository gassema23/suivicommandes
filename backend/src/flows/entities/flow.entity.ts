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
import { DeliverableDelayFlow } from '../../deliverable-delay-flows/entities/deliverable-delay-flow.entity';

@Entity('flows')
@Index(['flowName'])
@Index(['deletedAt'])
export class Flow {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'flow_name', length: 125, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  flowName?: string;

  @Column({ name: 'flow_description', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  flowDescription?: string;

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

  @OneToMany(() => DeliverableDelayFlow, (flow) => flow.deliverable)
  deliverableDelayFlows: DeliverableDelayFlow[];
}
