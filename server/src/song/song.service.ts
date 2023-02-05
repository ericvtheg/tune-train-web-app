import { Injectable } from '@nestjs/common';
import type { Opaque } from 'type-fest';
import { UserId } from 'src/user/user.service';
import { ArtistId } from 'src/artist/artist.service';
import { FileStorageService, DownloadLink, UploadLink } from 'src/common/services/file-storage/file-storage.service';
import { PrismaService } from 'nestjs-prisma';
import { Song as SongEntity } from '@prisma/client';

export type SongId = Opaque<number, 'SongId'>;
type ToBeCreatedSong = Omit<Song, 'id'>;

interface Song {
  id: SongId;
  artistId: ArtistId;
  title: string;
  description: string;
}

const transform = (entity: SongEntity): Song => ({
  id: entity.id as SongId,
  artistId: entity.artist_id as ArtistId,
  title: entity.title,
  description: entity.description,
});

const getKeyFromId = (id: SongId): string => {
  return `${id.toString().slice(-1)}/${id}`;
};

@Injectable()
export class SongService {
  constructor(private fileStorageService: FileStorageService, private prisma: PrismaService) {}

  async createSong(song: ToBeCreatedSong): Promise<Song> {
    const songEntity = await this.prisma.song.create({
      data: {
        title: song.title,
        description: song.description,
        artist_id: song.artistId,
      },
    });
    return transform(songEntity);
  }

  async findUnheardSong(userId: UserId): Promise<Song | null> {
    // TODO this should also return artist via prisma
    const songEntity = (await this.prisma.$queryRaw<SongEntity[]>`
    SELECT *
    FROM song
    WHERE NOT EXISTS (
      SELECT listen.id 
      FROM listen 
      WHERE song.id = listen.song_id
      AND listen.user_id = ${userId}
    )
    ORDER BY random()
    LIMIT 1;
  `)?.[0];
    return songEntity ? transform(songEntity) : null;
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