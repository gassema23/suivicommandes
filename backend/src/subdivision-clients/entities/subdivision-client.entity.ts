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
import { IsOptional, IsString,MaxLength } from 'class-validator';
import { Client } from '../../clients/entities/client.entity';
import { Expose } from 'class-transformer';

@Entity('subdivision_clients')
@Index(['subdivisionClientNumber'])
@Index(['deletedAt'])
export class SubdivisionClient {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;


  @ManyToOne(() => Client, (client) => client.subdivisionClients, {
    nullable: false,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'subdivision_client_name', length: 125, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  subdivisionClientName?: string;

  @Column({ name: 'subdivision_client_number', length: 25, nullable: false })
  @IsString()
  @MaxLength(25)
  subdivisionClientNumber!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  @IsOptional()
  createdBy?: Partial<User>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  @IsOptional()
  updatedBy?: Partial<User>;

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

  // Virtual properties
  @Expose()
  get virtualSubdivisionClientName(): string {
    if (this.subdivisionClientName && this.subdivisionClientNumber) {
      return `${this.subdivisionClientName} (${this.subdivisionClientNumber})`;
    }
    if (this.subdivisionClientName) {
      return this.subdivisionClientName;
    }
    if (this.subdivisionClientName) {
      return this.subdivisionClientName;
    }
    return '';
  }
}
