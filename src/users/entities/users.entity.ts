import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SongsEntity } from '../../songs/entities/songs.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  isArtist: boolean;

  @Column({ nullable: true })
  stageName: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  spotify: string;

  @Column({ nullable: true })
  appleMusic: string;

  @Column({ nullable: true })
  soundCloud: string;

  @Column({ nullable: true })
  patreon: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  tikTok: string;

  @Column({ nullable: true })
  youtube: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  beatPort: string;

  @OneToMany((type) => UsersEntity, (user) => user.id) Song: SongsEntity[];
}
