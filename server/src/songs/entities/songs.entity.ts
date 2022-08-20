import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArtistsEntity } from '../../artists/entities/artists.entity';
import { ListensEntity } from './listens.entity';

@Entity('songs')
@Unique('title_artistId_unique_constraint', ['title', 'artistId'])
export class SongsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  artistId: number;

  @ManyToOne(() => ArtistsEntity, { nullable: false, onDelete: 'CASCADE'},)
  Artist: ArtistsEntity;

  @OneToMany(() => ListensEntity, (listen) => listen.song)
  listens: ListensEntity[];
}
