import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArtistsEntity } from '../../artist/entities/artists.entity';
import { ListensEntity } from '../../songs/entities/listens.entity';

export const UNIQUE_USER_EMAIL_CONSTRAINT = 'email_index_unique_constraint';
export const UNIQUE_USER_USERNAME_CONSTRAINT = 'username_index_unique_constraint';

// TODO delete

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @Index(UNIQUE_USER_EMAIL_CONSTRAINT, { unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Index(UNIQUE_USER_USERNAME_CONSTRAINT, { unique: true })
  @Column()
  username: string;

  @Column()
  isArtist: boolean;

  @OneToOne(() => ArtistsEntity, (artist) => artist.user)
  artist: ArtistsEntity;

  @OneToMany(() => ListensEntity, (listen) => listen.User)
  listens: ListensEntity[];
}
