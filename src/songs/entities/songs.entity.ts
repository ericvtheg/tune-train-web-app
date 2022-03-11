import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ArtistsEntity } from '../../artists/entities/artists.entity';
import { ListensEntity } from './listens.entity';

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

  @OneToMany(() => ListensEntity, (listen) => listen.song)
  // @JoinColumn()
  listens: ListensEntity[];
}
