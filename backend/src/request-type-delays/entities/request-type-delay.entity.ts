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
import { IsOptional } from 'class-validator';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { DelayType } from '../../delay-types/entities/delay-type.entity';

@Entity('request_type_delays')
@Index(['deletedAt'])
export class RequestTypeDelay {
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

  @ManyToOne(() => DelayType, (delayType) => delayType.requestTypeDelays, {
    nullable: false,
  })
  @JoinColumn({ name: 'delay_type_id' })
  delayType: DelayType;

  @Column({ name: 'delay_value', type: 'int', default: 0 })
  @IsOptional()
  delayValue?: number;

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
