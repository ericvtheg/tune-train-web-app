import { Injectable } from '@nestjs/common';
import type { Opaque } from 'type-fest';
import { UserId } from 'src/user/user.service';
import { ArtistId } from 'src/artist/artist.service';
import { SongEntity, SongRepository } from 'src/song/song.repository';
import { FileStorageService, DownloadLink, UploadLink } from 'src/common/services/file-storage/file-storage.service';
import { ListenId } from 'src/listen/listen.service';

export type SongId = Opaque<string, 'SongId'>;
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
  return `${id.slice(-1)}/${id}`;
};

@Injectable()
export class SongService {
  constructor(
    private songRepository: SongRepository,
    private fileStorageService: FileStorageService,
  ) {}

  async createSong(song: ToBeCreatedSong): Promise<Song> {
    const songEntityInput = {
      title: song.title,
      description: song.description,
      artist_id: song.artistId,
    };
    const songEntity = await this.songRepository.saveOne(songEntityInput);
    return transform(songEntity);
  }

  async findSongById(id: SongId): Promise<Song | null> {
    const songEntity = await this.songRepository.findOneById(id);
    return songEntity ? transform(songEntity) : null;
  }

  async findListenedToSong(listenId: ListenId): Promise<Song | null> {
    const songEntity = await this.songRepository.findOneByListenId(listenId);
    return songEntity ? transform(songEntity) : null;
  }

  async findArtistSongs(artistId: ArtistId): Promise<Song[]> {
    const songEntities = await this.songRepository.findManyByArtistId(artistId);
    return songEntities.map(songEntities => transform(songEntities));
  }

  async findUnheardSong(userId: UserId): Promise<Song | null> {
    const songEntity = await this.songRepository.findOneWithNoListensFromUser(userId);
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