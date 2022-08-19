import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SongsEntity } from './songs.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity('listens')
@Unique('userId_songId_unique_constraint', ['userId', 'songId'])
export class ListensEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  songId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  liked: boolean;

  @ManyToOne(() => UsersEntity, { nullable: false })
  User: UsersEntity;

  @ManyToOne(() => SongsEntity, (song) => song.listens, { nullable: false })
  song: SongsEntity;
}
