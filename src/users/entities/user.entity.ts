import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Song } from '../../songs/entities/song.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  isArtist: boolean;

  @Column()
  stageName: string;

  @Column()
  bio: string;

  @Column()
  image: string;

  @Column()
  spotify: string;

  @Column()
  appleMusic: string;

  @Column()
  soundCloud: string;

  @Column()
  patreon: string;

  @Column()
  instagram: string;

  @Column()
  tikTok: string;

  @Column()
  youtube: string;

  @Column()
  twitter: string;

  @Column()
  beatPort: string;

  @OneToMany((type) => User, (user) => user.id) Song: Song[];
}
