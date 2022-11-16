import type { Opaque } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { ArtistRepository, ArtistEntity } from 'src/artist/artist.repository';
import { SongId } from 'src/song/song.service';
import { ListenId } from 'src/listen/listen.service';
import { UserId } from 'src/user/user.service';


export type ArtistId = Opaque<string, 'ArtistId'>;

interface Artist {
  id: ArtistId;
  stageName: string;
  bio: string;
  image: string;
}

type UpdateArtist = Partial<Omit<Artist, 'id'>>;

type ToBeCreatedArtist = {
  stageName: string;
  bio: string;
  image: string;
  userId: UserId;
};

const transform = (entity: ArtistEntity): Artist => ({
  id: entity.id as ArtistId,
  stageName: entity.stage_name,
  bio: entity.bio,
  image: entity.image,
});

@Injectable()
export class ArtistService {
  constructor(private artistRepository: ArtistRepository) {}

  async createArtist(artist: ToBeCreatedArtist): Promise<Artist> {
    const artistEntityInput = {
      stage_name: artist.stageName,
      bio: artist.bio,
      image: artist.image,
      user_id: artist.userId,
    };
    const artistEntity = await this.artistRepository.saveOne(artistEntityInput);
    return transform(artistEntity);
  }

  async updateArtist(id: ArtistId, partialArtist: UpdateArtist): Promise<Artist> {
    const artistEntityUpdateInput = {
      stage_name: partialArtist.stageName,
      bio: partialArtist.bio,
      image: partialArtist.image,
    };
    const artistEntity = await this.artistRepository.updateOne(id, artistEntityUpdateInput);
    return transform(artistEntity);
  }

  async findArtistById(id: ArtistId): Promise<Artist | null> {
    const artistEntity = await this.artistRepository.findOneById(id);
    return artistEntity ? transform(artistEntity) : null;
  }

  async findArtistByUserId(id: UserId): Promise<Artist | null> {
    const artistEntity = await this.artistRepository.findOneByUserId(id);
    return artistEntity ? transform(artistEntity) : null;
  }

  async findArtistBySongId(songId: SongId): Promise<Artist | null> {
    const artistEntity = await this.artistRepository.findOneBySongId(songId);
    return artistEntity ? transform(artistEntity) : null;
  }

  async findArtistByListenId(listenId: ListenId): Promise<Artist | null> {
    const artistEntity = await this.artistRepository.findOneByListenId(listenId);
    return artistEntity ? transform(artistEntity) : null;
  }
}