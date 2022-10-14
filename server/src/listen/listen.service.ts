import { Injectable } from "@nestjs/common";
import { Opaque } from "type-fest";
import { UserId } from "src/user/user.service";
import { ListenRepository } from "src/listen/listen.repository";

type ListenId = Opaque<string>;
interface Listen {
  // artist
    // socials
  // song
}

@Injectable()
export class ListenService {
  constructor(private listenRepository: ListenRepository) {}

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
}