import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class UserModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;
}
