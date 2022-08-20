import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsEntity } from '../../src/artists/entities/artists.entity';
import { SocialsEntity } from '../../src/artists/entities/socials.entity';
import { UsersEntity } from '../../src/users/entities/users.entity';
import { ListensEntity } from '../../src/songs/entities/listens.entity';
import { SongsEntity } from '../../src/songs/entities/songs.entity';

export const TypeOrmSQLITETestingModule = (): DynamicModule[] => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [SongsEntity, ArtistsEntity, SocialsEntity, UsersEntity, ListensEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([SongsEntity, ArtistsEntity, SocialsEntity, UsersEntity, ListensEntity]),
];