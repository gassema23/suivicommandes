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
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

@Entity('holidays')
@Index(['holidayName', 'holidayDate'])
@Index(['deletedAt'])
export class Holiday {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'holiday_date', type: 'date' })
  @IsDate()
  holidayDate: Date;

  @Column({ name: 'holiday_name', length: 125, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  holidayName?: string;

  @Column({ name: 'holiday_description', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  holidayDescription?: string;

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
