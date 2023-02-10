import type { Opaque } from 'type-fest';
import { Artist as ArtistEntity } from '@prisma/client';

export type ArtistId = Opaque<number, 'ArtistId'>;

export interface Artist {
  id: ArtistId;
  stageName: string;
  bio: string;
}

export interface ToBeCreatedArtist {
  stageName: string;
  bio: string;
}

export const transform = (entity: ArtistEntity): Artist => ({
  id: entity.id as ArtistId,
  stageName: entity.stage_name,
  bio: entity.bio,
});
