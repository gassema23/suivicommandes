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
import { Expose } from 'class-transformer';

@Entity('teams')
@Index(['teamName'])
@Index(['deletedAt'])
export class Team {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'owner_id', nullable: true })
  @IsOptional()
  ownerId?: string;

  // Relation vers l'utilisateur propriétaire de l'équipe
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  @IsOptional()
  owner?: Partial<User>;

  @Column({ name: 'team_name', length: 100 })
  @IsString()
  @MaxLength(100)
  teamName: string;

  @Column({ name: 'team_description', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  teamDescription?: string;

  // Relation vers les utilisateurs membres de l'équipe
  @OneToMany(() => User, (user) => user.team)
  users: User[];

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

  @Expose()
  // Propriété virtuelle pour compter les membres de l'équipe
  get memberCount(): number {
    return this.users?.length || 0;
  }
}