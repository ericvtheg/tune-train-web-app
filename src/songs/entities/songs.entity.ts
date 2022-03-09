import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity('songs')
export class SongsEntity {
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
  @ManyToOne((type) => SongsEntity, (song) => song.userId) User: UsersEntity;
}
