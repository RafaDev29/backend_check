
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tracking')
export class TrackingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;
}
