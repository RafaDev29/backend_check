
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from '../../users/infrastructure/persistence/user.model';

export enum RecordStatus {
  INIT = 'init',
  FINISH = 'finish',
}

@Entity('records')
export class RecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.INIT,
  })
  status: RecordStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}