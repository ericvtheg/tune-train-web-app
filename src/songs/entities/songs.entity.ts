import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ArtistsEntity } from '../../artists/entities/artists.entity';

@Entity('songs')
@Unique(['title', 'artistId'])
export class SongsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  fileName: string;

  @Column()
  description: string;

  @Column()
  artistId: number;

  @ManyToOne(() => ArtistsEntity, { nullable: false })
  @JoinColumn()
  Artist: ArtistsEntity;
}
