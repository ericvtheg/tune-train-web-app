import { Injectable } from '@nestjs/common';
import type { Opaque } from 'type-fest';
import { UserId } from 'src/user/user.service';
import { ArtistId, Artist, transform as artistTransform } from 'src/artist/artist.service';
import { FileStorageService, DownloadLink, UploadLink } from 'src/services/file-storage/file-storage.service';
import { PrismaService } from 'nestjs-prisma';
import { Song as SongEntity, Artist as ArtistEntity } from '@prisma/client';

export type SongId = Opaque<number, 'SongId'>;

interface Song {
  id: SongId;
  title: string;
  description: string;
  artist: Artist;
}

interface ToBeCreatedSong {
  title: string;
  description: string;
}

type SongAndArtistEntity = SongEntity & { artist: ArtistEntity };

const transform = (entity: SongAndArtistEntity): Song => ({
  id: entity.id as SongId,
  title: entity.title,
  description: entity.description,
  artist: artistTransform(entity.artist),
});

const getKeyFromId = (id: SongId): string => {
  return `${id.toString().slice(-1)}/${id}`;
};

@Injectable()
export class SongService {
  constructor(private fileStorageService: FileStorageService, private prisma: PrismaService) {}

  async createSong(song: ToBeCreatedSong, userId: UserId): Promise<Song> {
    // TODO how to validate there is a file for this song
    const songEntity = await this.prisma.song.create({
      data: {
        title: song.title,
        description: song.description,
        artist: {
          connect: {
            user_id: userId,
          },
        },
      },
      include: { artist: true },
    });
    return transform(songEntity);
  }

  async findUnheardSong(userId: UserId): Promise<Song | null> {
    type queryRawResultType = {
      id: number, title: string, description: string,
      artist_id: number, stage_name: string, bio: string,
      song_created_at: Date, song_updated_at: Date,
      artist_created_at: Date, artist_updated_at: Date
    };

    const queryRawResult = (await this.prisma.$queryRaw<queryRawResultType[]>`
      SELECT song.id, song.title, song.description, song.created_at as song_created_at, 
        song.updated_at as song_updated_at, artist.id as artist_id, artist.stage_name, artist.bio,
        artist.created_at as artist_created_at, artist.updated_at as artist_updated_at
      FROM song
      JOIN artist ON artist.id = song.artist_id
      WHERE NOT EXISTS (
        SELECT listen.id 
        FROM listen 
        WHERE song.id = listen.song_id
        AND listen.user_id = ${userId}
      )
      ORDER BY random()
      LIMIT 1;
    `)?.[0];

    if (!queryRawResult){
      // TODO handle this error
      throw new Error('No unheard songs found!');
    }

    return {
      id: queryRawResult.id as SongId,
      title: queryRawResult.title,
      description: queryRawResult.description,
      artist: {
        id: queryRawResult.artist_id as ArtistId,
        stageName: queryRawResult.stage_name,
        bio: queryRawResult.bio,
      },
    };
  }

  async getSongDownloadLink(id: SongId): Promise<DownloadLink> {
    // TODO can we make this fail if the item doesn't exist?
    const key = getKeyFromId(id);
    return await this.fileStorageService.generateDownloadLink(key);
  }

  async getSongUploadLink(id: SongId): Promise<UploadLink> {
    const key = getKeyFromId(id);
    return await this.fileStorageService.generateUploadLink(key);
  }
}