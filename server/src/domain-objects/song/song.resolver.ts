import {
  Query,
  Resolver,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import {
  SongModel,
  CreateSongInput,
  CreateSongResponse,
  DiscoverSongResponse,
  FileDownload,
} from 'src/domain-objects/song/song.model';
import { SongService, Song } from 'src/domain-objects/song/song.service';
import { FileStorageService } from 'src/services/file-storage/file-storage.service';
import { UserId } from 'src/domain-objects/user/user.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Id } from 'src/common/decorators/id.decorator';

@Resolver(() => SongModel)
export class SongResolver {
  constructor(
    private songService: SongService,
    private fileStorageService: FileStorageService
  ) {}

  @Mutation((returns) => CreateSongResponse)
  @UseGuards(JwtAuthGuard)
  async createSong(
    @Args('input') createSongData: CreateSongInput,
    @Id() userId: UserId
  ): Promise<CreateSongResponse> {
    // check that song file exists
    const fileExists = await this.fileStorageService.fileExists(
      createSongData.fileName
    );
    if (!fileExists) {
      Logger.error('Attempted to create song with non existent file');
      throw new Error('Can not create song with non existent file');
    }

    const song = await this.songService.createSong(createSongData, userId);
    return { song };
  }

  @Query((returns) => DiscoverSongResponse)
  @UseGuards(JwtAuthGuard)
  async discoverSong(@Id() userId: UserId): Promise<DiscoverSongResponse> {
    // TODO would like to not require auth for this
    const song = await this.songService.findUnheardSong(userId);
    return { song };
  }

  @ResolveField('fileDownload', (returns) => FileDownload)
  async downloadLink(@Parent() song: Song): Promise<FileDownload> {
    const { fileName } = song;
    const link = await this.songService.getSongDownloadLink(fileName);
    return { link };
  }
}
