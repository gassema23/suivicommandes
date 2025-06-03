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
import { IsOptional, IsString, Max, MaxLength } from 'class-validator';
import { SubdivisionClient } from 'src/subdivision-clients/entities/subdivision-client.entity';

@Entity('clients')
@Index(['clientNumber'])
@Index(['deletedAt'])
export class Client {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'client_name', length: 125, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  clientName?: string;

  @Column({ name: 'client_number', length: 25, nullable: false })
  @IsString()
  @MaxLength(25)
  clientNumber?: string;

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

  @OneToMany(() => SubdivisionClient, (sub) => sub.client)
  subdivisionClients?: SubdivisionClient[];
}
