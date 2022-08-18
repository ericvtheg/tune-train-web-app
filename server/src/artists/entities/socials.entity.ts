import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ArtistsEntity } from './artists.entity';

@Entity('socials')
export class SocialsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ArtistsEntity, (artist) => artist.socials)
  @JoinColumn()
  artist: ArtistsEntity;

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
}