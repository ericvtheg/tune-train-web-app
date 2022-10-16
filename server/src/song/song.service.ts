import { Injectable } from '@nestjs/common';
import type { Opaque } from 'type-fest';
import { SongEntity, SongRepository } from 'src/song/song.repository';

export type SongId = Opaque<string, "SongId">;

interface Song {
  id: SongId;
  title: string;
  description: string;
}

const transform = (entity: SongEntity): Song => ({
  id: entity.id as SongId,
  title: entity.title,
  description: entity.description
})

@Injectable()
export class SongService {
  constructor(private songRepository: SongRepository) {}

  async findSongById(id: SongId): Promise<Song> {
    const song = await this.songRepository.findOneById(id);
    return song ? transform(song) : null;
    // use fileStorageService to fetch download url here
  }

  async getSongDownloadLink(id: SongId): Promise<any> {
    // song filename should only depend on song
    // determine how to distribute keys in s3 dirs
  }
}