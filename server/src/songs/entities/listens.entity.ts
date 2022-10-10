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
import { UsersEntity } from '../../user/entities/users.entity';

export const UNIQUE_LISTEN_SONGID_USERID_CONSTRAINT = 'userId_songId_unique_constraint';

@Entity('listens')
@Unique('userId_songId_unique_constraint', ['userId', 'songId'])
export class ListensEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  songId: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @Column()
  liked: boolean;

  @ManyToOne(() => UsersEntity, { nullable: false, onDelete: 'CASCADE', })
  User: UsersEntity;

  @ManyToOne(() => SongsEntity, (song) => song.listens, { nullable: false, onDelete: 'CASCADE', })
  song: SongsEntity;
}
