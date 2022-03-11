import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SongsEntity } from '../../songs/entities/songs.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity('artists')
export class ArtistsEntity {
  @PrimaryColumn()
  id: number;

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

  // this is wrong, look into doing bidirectional w/e
  @OneToMany(() => ArtistsEntity, (artist) => artist.id)
  Song: SongsEntity[];

  // this is wrong, look into doing bidirectional w/e
  @OneToOne(() => UsersEntity)
  @JoinColumn()
  user: UsersEntity;
}
