import { Injectable } from '@nestjs/common';
import type { Opaque } from 'type-fest';
import { SongEntity, SongRepository } from 'src/song/song.repository';


export type SongId = Opaque<string>;

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
    return transform(await this.songRepository.findOneById(id));
    // use fileStorageService to fetch download url here
  }
}