import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { Song, CreateSongInput } from 'src/song/song.model';
import { SongService, SongId } from 'src/song/song.service';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/artist/artist.model';
import { UserId } from 'src/user/user.service';
import { Listen } from 'src/listen/listen.model';
import { ListenService } from 'src/listen/listen.service';

@Resolver(() => Song)
export class SongResolver {
  constructor(
    private songService: SongService,
    private listenService: ListenService,
    private artistService: ArtistService,
  ) {}

  @Mutation(returns => Song)
  async createSong(@Args('createSongData') createSongData: CreateSongInput): Promise<Song> {
    // TODO pull artist id off token
    return await this.songService.createSong({
      artistId: 'someId' as any,
      ...createSongData,
    });
  }

  @Query(returns => Song, { nullable: true })
  async song(@Args('id') id: SongId): Promise<Song | null> {
    return await this.songService.findSongById(id);
  }

  @Query(returns => Song, { nullable: true })
  async findUnheardSong(@Args('userId') userId: UserId): Promise<Song | null> {
    return await this.songService.findUnheardSong(userId);
  }

  @ResolveField('downloadLink', returns => String)
  async downloadLink(@Parent() song: Song): Promise<string>{
    const { id } = song;
    return await this.songService.getSongDownloadLink(id);
  }

  @ResolveField('listens', returns => [Listen], { nullable: 'items' })
  async listens(@Parent() song: Song): Promise<Listen[]> {
    const { id } = song;
    return await this.listenService.findSongListens(id);
  }

  @ResolveField('artist', returns => Artist)
  async artist(@Parent() song: Song): Promise<Artist | null> {
    const { id } = song;
    return await this.artistService.findArtistBySongId(id);
  }
}