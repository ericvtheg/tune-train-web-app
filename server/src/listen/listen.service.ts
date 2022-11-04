import { Injectable } from "@nestjs/common";
import { Opaque } from "type-fest";
import { UserId } from "src/user/user.service";
import { SongId } from "src/song/song.service";
import { ArtistId } from "src/artist/artist.service";
import { ListenRepository, ListenEntity } from "src/listen/listen.repository";

export type ListenId = Opaque<string, "ListenId">;

interface Listen {
  id: ListenId;
  artistId: ArtistId;
  songId: SongId;
  userId: UserId;
  liked: boolean | null;
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

  async findUserListens(userId: UserId): Promise<Listen[]> {
    const listenEntities = await this.listenRepository.findUserListens(userId);
    return listenEntities.map(listenEntity => transform(listenEntity));
  }

  async findSongListens(songId: SongId): Promise<Listen[]> {
    const listenEntities = await this.listenRepository.findSongListens(songId);
    return listenEntities.map(listenEntity => transform(listenEntity));
  }

  // find artist listens

}