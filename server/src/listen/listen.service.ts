import { Injectable } from "@nestjs/common";
import { Opaque } from "type-fest";
import { UserId } from "src/user/user.service";
import { SongId } from "src/song/song.service";
import { ArtistId } from "src/artist/artist.service";
import { ListenRepository, ListenEntity } from "src/listen/listen.repository";

type ListenId = Opaque<string, "ListenId">;

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

  // rename this function
  async findUnheardListen(id: UserId): Promise<any> {
    // get random song and artist ID
    const [songId, artistId ] = await this.listenRepository.findSongWithNoListen(id);
    // this feels like a resolvers job...but all of the subsequent functions depend on random listen
    // https://github.com/lucasconstantino/graphql-resolvers/blob/master/docs/API.md#field-dependency-tools
    
    // get song
    // get downloadlink
    // get artist
    // 
  }

  async findUserListens(userId: UserId): Promise<Listen[]> {
    const listens = await this.listenRepository.findUserListens(userId);
    return listens.map(listen => transform(listen));
  }

  async findSongListens(songId: SongId): Promise<Listen[]> {
    const listens = await this.listenRepository.findSongListens(songId);
    return listens.map(listen => transform(listen));
  }

}