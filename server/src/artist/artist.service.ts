import type { Opaque } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { ArtistRepository, ArtistEntity } from 'src/artist/artist.repository';
import { UserId } from 'src/user/user.service';


export type ArtistId = Opaque<number, 'ArtistId'>;

interface Artist {
  id: ArtistId;
  stageName: string;
  bio: string;
}

type ToBeCreatedArtist = Omit<Artist, 'id'>;

const transform = (entity: ArtistEntity): Artist => ({
  id: entity.id as ArtistId,
  stageName: entity.stage_name,
  bio: entity.bio,
});

@Injectable()
export class ArtistService {
  constructor(private artistRepository: ArtistRepository) {}

  async createArtist(userId: UserId, artist: ToBeCreatedArtist): Promise<Artist> {
    const artistEntityInput = {
      stage_name: artist.stageName,
      bio: artist.bio,
    };
    const artistEntity = await this.artistRepository.saveOne(userId, artistEntityInput);
    return transform(artistEntity);
  }
}