import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Song, CreateSongInput, DeleteSongResponse, CreateSongResponse, Download } from 'src/song/song.model';
import { SongService, SongId } from 'src/song/song.service';
import { ArtistService, ArtistId } from 'src/artist/artist.service';
import { Artist } from 'src/artist/artist.model';
import { UserId } from 'src/user/user.service';
import { Listen } from 'src/listen/listen.model';
import { ListenService } from 'src/listen/listen.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Id } from 'src/common/decorators/id.decorator';

@Resolver(() => Song)
export class SongResolver {
  constructor(
    private songService: SongService,
    private listenService: ListenService,
    private artistService: ArtistService,
  ) {}

  @Mutation(returns => CreateSongResponse)
  @UseGuards(JwtAuthGuard)
  async createSong(
    @Args('input') createSongData: CreateSongInput,
      @Id() artistId: ArtistId,
  ): Promise<CreateSongResponse> {
    const song = await this.songService.createSong({
      artistId,
      ...createSongData,
    });
    return { song };
  }

  @Mutation(returns => DeleteSongResponse)
  @UseGuards(JwtAuthGuard)
  async deleteSong(@Args('id') id: SongId): Promise<DeleteSongResponse> {
    // TODO should I use artistId here to make sure people can only delete their own songs?
    await this.songService.deleteSong(id);
    return { result: 'Successfully deleted song' };
  }

  @Query(returns => Song, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async discoverSong(@Id() userId: UserId): Promise<Song | null> {
    // TODO would like to not require auth for this
    return await this.songService.findUnheardSong(userId);
  }

  @Query(returns => Song, { nullable: true })
  async song(@Args('id') id: SongId): Promise<Song | null> {
    return await this.songService.findSongById(id);
  }

  @ResolveField('download', returns => Download)
  async downloadLink(@Parent() song: Song): Promise<Download>{
    const { id } = song;
    const link = await this.songService.getSongDownloadLink(id);
    return { link };
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