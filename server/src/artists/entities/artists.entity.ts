import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SongsEntity } from '../../songs/entities/songs.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { SocialsEntity } from './socials.entity';

@Entity('artists')
export class ArtistsEntity {
  @PrimaryColumn()
  id: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @Column({ nullable: true })
  stageName: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => ArtistsEntity, (artist) => artist.id, {
    onDelete: 'CASCADE',
  })
  songs: SongsEntity[];

  @OneToOne(() => UsersEntity, (user) => user.artist)
  @JoinColumn({ referencedColumnName: 'id', name: 'id' })
  user: UsersEntity;

  @OneToOne(() => SocialsEntity, (social) => social.artist, {
    cascade: true,
    eager: true,
  })
  socials: SocialsEntity;
}