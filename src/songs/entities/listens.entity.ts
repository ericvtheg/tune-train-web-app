import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { SongsEntity } from './songs.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity('listens')
@Unique(['userId', 'songId'])
export class ListensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  liked: boolean;

  @Column()
  userId: number;

  @Column()
  songId: number;

  @ManyToOne(() => UsersEntity, { nullable: false })
  @JoinColumn()
  User: UsersEntity;

  @ManyToOne(() => SongsEntity, (song) => song.listens, { nullable: false })
  // @JoinColumn()
  song: SongsEntity;
}
