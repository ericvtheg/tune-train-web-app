import type { Opaque } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { ArtistRepository, ArtistEntity } from 'src/artist/artist.repository';
import { SongId } from "src/song/song.service";


export type ArtistId = Opaque<string, "ArtistId">;
interface Artist { 
  id: ArtistId;
  stageName: string;
  bio: string;
  image: string;
}

const transform = (entity: ArtistEntity): Artist => ({
  id: entity.id as ArtistId,
  stageName: entity.stage_name,
  bio: entity.bio,
  image: entity.image,
});

@Injectable()
export class ArtistService {
  constructor(private artistRepository: ArtistRepository) {}

  async findArtistById(id: ArtistId): Promise<Artist> {
    const artist = await this.artistRepository.findOneById(id);
    return artist ? transform(artist) : null;
  }

  async findArtistBySongId(songId: SongId): Promise<Artist> {
    const artist = await this.artistRepository.findOneBySongId(songId);
    return artist ? transform(artist) : null;
  }
}