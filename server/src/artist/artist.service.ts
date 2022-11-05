import type { Opaque } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { ArtistRepository, ArtistEntity } from 'src/artist/artist.repository';
import { SongId } from "src/song/song.service";
import { ListenId } from "src/listen/listen.service";


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
    const artistEntity = await this.artistRepository.findOneById(id);
    return artistEntity ? transform(artistEntity) : null;
  }

  async findArtistBySongId(songId: SongId): Promise<Artist> {
    const artistEntity = await this.artistRepository.findOneBySongId(songId);
    return artistEntity ? transform(artistEntity) : null;
  }

  async findArtistByListenId(listenId: ListenId): Promise<Artist> {
    const artistEntity = await this.artistRepository.findOneByListenId(listenId);
    return artistEntity ? transform(artistEntity) : null;
  }

  // create artist
}