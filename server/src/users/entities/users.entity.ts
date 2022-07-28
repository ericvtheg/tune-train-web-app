import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

// TODO: make unique name a constant
@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('email_index_unique_constraint', { unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column()
  isArtist: boolean;
}
