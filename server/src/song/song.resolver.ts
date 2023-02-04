import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import {
  Song,
  CreateSongInput,
  CreateSongResponse,
  DiscoverSongResponse,
  FileDownload,
} from 'src/song/song.model';
import { SongService } from 'src/song/song.service';
import { ArtistId } from 'src/artist/artist.service';
import { UserId } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Id } from 'src/common/decorators/id.decorator';

@Resolver(() => Song)
export class SongResolver {
  constructor(private songService: SongService) {}

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

  @ResolveField('fileDownload', returns => FileDownload)
  async downloadLink(@Parent() song: Song): Promise<FileDownload>{
    const { id } = song;
    const link = await this.songService.getSongDownloadLink(id);
    return { link };
  }
}