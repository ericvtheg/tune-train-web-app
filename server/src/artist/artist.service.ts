import type { Opaque } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { ArtistRepository, ArtistEntity } from 'src/artist/artist.repository';


export type ArtistId = Opaque<string>;
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
    return transform(await this.artistRepository.findOneById(id));
  }
}