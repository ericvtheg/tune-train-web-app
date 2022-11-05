import { Query, Resolver, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Artist } from "src/artist/artist.model";
import { ArtistService, ArtistId } from "src/artist/artist.service";
import { ListenService } from "src/listen/listen.service";
import { Listen } from "src/listen/listen.model";
import { Song } from "src/song/song.model";
import { SongService } from "src/song/song.service";

@Resolver(of => Artist)
export class ArtistResolver {
  constructor(
    private artistService: ArtistService,
    private listenService: ListenService,
    private songService: SongService,
  ) {}
  
  @Query(returns => Artist,  { nullable: true })
  async artist(@Args('id') id: ArtistId): Promise<Artist> {
    return await this.artistService.findArtistById(id);
  }

  @ResolveField("listens")
  async listens(@Parent() artist: Artist): Promise<Listen[]> {
    const { id } = artist;
    return await this.listenService.findArtistListens(id as ArtistId);
  }

  // songs
  @ResolveField("songs")
  async songs(@Parent() artist: Artist): Promise<Song[]> {
    const { id } = artist;
    return await this.songService.findArtistSongs(id as ArtistId);
  }
}