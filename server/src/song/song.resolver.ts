import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import {
  Song,
  SongResponse,
  CreateSongInput,
  DeleteSongResponse,
  CreateSongResponse,
  DiscoverSongResponse,
  FileDownload,
} from 'src/song/song.model';
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

  @Query(returns => DiscoverSongResponse)
  @UseGuards(JwtAuthGuard)
  async discoverSong(@Id() userId: UserId): Promise<DiscoverSongResponse> {
    // TODO would like to not require auth for this
    const song = await this.songService.findUnheardSong(userId);
    return { song };
  }

  @Query(returns => SongResponse)
  async song(@Args('id') id: SongId): Promise<SongResponse> {
    const song = await this.songService.findSongById(id);
    return { song };
  }

  @ResolveField('fileDownload', returns => FileDownload)
  async downloadLink(@Parent() song: Song): Promise<FileDownload>{
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