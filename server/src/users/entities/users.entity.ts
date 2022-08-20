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
import { ArtistsEntity } from '../../artists/entities/artists.entity';
import { ListensEntity } from '../../songs/entities/listens.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @CreateDateColumn({ select: false })
    createdAt: Date;

  @UpdateDateColumn({ select: false })
    updatedAt: Date;

  @Index('email_index_unique_constraint', { unique: true })
  @Column()
    email: string;

  @Column()
    password: string;

  @Column({ unique: true })
    username: string;

  @Column()
    isArtist: boolean;

  @OneToOne(() => ArtistsEntity, (artist) => artist.user)
    artist: ArtistsEntity;

  @OneToMany(() => ListensEntity, (listen) => listen.User, {
    onDelete: 'CASCADE',
  })
    listens: ListensEntity[];
}
