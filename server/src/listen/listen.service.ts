import { Injectable } from '@nestjs/common';
import { Opaque } from 'type-fest';
import { UserId } from 'src/user/user.service';
import { SongId } from 'src/song/song.service';
import { ArtistId } from 'src/artist/artist.service';
import { ListenRepository, ListenEntity } from 'src/listen/listen.repository';

export type ListenId = Opaque<string, 'ListenId'>;

interface Listen {
  id: ListenId;
  artistId: ArtistId;
  songId: SongId;
  userId: UserId;
  liked: boolean;
}

const transform = (entity: ListenEntity): Listen => ({
  id: entity.id as ListenId,
  artistId: entity.artist_id as ArtistId,
  songId: entity.song_id as SongId,
  userId: entity.user_id as UserId,
  liked: entity.liked,
});

@Injectable()
export class ListenService {
  constructor(private listenRepository: ListenRepository) {}

  // createListen
  // would like this to be called by some sort of queue service
  // see what nestjs offers out of the box

  async findListenById(id: ListenId): Promise<Listen | null> {
    const listenEntity = await this.listenRepository.findOneById(id);
    return listenEntity ? transform(listenEntity) : null;
  }

  async findUserListens(userId: UserId): Promise<Listen[]> {
    const listenEntities = await this.listenRepository.findManyByUserId(userId);
    return listenEntities.map(listenEntity => transform(listenEntity));
  }

  async findSongListens(songId: SongId): Promise<Listen[]> {
    const listenEntities = await this.listenRepository.findManyBySongId(songId);
    return listenEntities.map(listenEntity => transform(listenEntity));
  }

  async findArtistListens(artistId: ArtistId): Promise<Listen[]> {
    const listenEntities = await this.listenRepository.findManyByArtistId(artistId);
    return listenEntities.map(listenEntity => transform(listenEntity));
  }
}