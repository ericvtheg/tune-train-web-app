import { ArtistsEntity } from 'src/artists/entities/artists.entity';
import { ListensEntity } from 'src/songs/entities/listens.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, OneToMany } from 'typeorm';

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

  @OneToOne(() => ArtistsEntity, (artist) => artist.user)
  artist: ArtistsEntity;

  @OneToMany(() => ListensEntity, (listen) => listen.User, {
    onDelete: 'CASCADE',
  })
  listens: ListensEntity[];
}
