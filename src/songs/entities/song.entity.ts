import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  userId: number;

  // TODO: this probably needs work
  @ManyToOne((type) => Song, (song) => song.userId) User: User;
}
