import { Query, Resolver, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Song } from 'src/song/song.model';
import { SongService, SongId } from "src/song/song.service";
import { ArtistService } from "src/artist/artist.service";
import { Artist } from 'src/artist/artist.model';
import { UserId } from "src/user/user.service";
import { Listen } from 'src/listen/listen.model';
import { ListenService } from 'src/listen/listen.service';

@Resolver(of => Song)
export class SongResolver {
  constructor(
    private songService: SongService,
    private listenService: ListenService,
    private artistService: ArtistService
  ) {}

    @Query(returns => Song,  { nullable: true })
    async song(@Args('id') id: SongId): Promise<Song> {
      return await this.songService.findSongById(id);
    }

    @Query(returns => Song)
    async findUnheardSong(@Args('userId') userId: UserId): Promise<Song> {
      return await this.songService.findUnheardSong(userId);
    }

    @ResolveField("downloadLink")
    async downloadLink(@Parent() song: Song): Promise<string>{
      const { id } = song;
      return await this.songService.getSongDownloadLink(id as SongId);
    }

    @ResolveField("listens", returns => [Listen], { nullable: 'items' })
    async listens(@Parent() song: Song): Promise<Listen[]> {
      const { id } = song;
      return await this.listenService.findSongListens(id as SongId);
    }

    @ResolveField("artist", returns => Artist)
    async artist(@Parent() song: Song): Promise<Artist> {
      const { id } = song;
      return await this.artistService.findArtistBySongId(id as SongId);
    }
}