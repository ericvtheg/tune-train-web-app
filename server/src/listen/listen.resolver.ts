import { Resolver, Query, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Listen, ListenResponse, ListenToSongInput, ListenToSongResponse } from 'src/listen/listen.model';
import { UserId, UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';
import { ListenService, ListenId } from 'src/listen/listen.service';
import { Song } from 'src/song/song.model';
import { SongService } from 'src/song/song.service';
import { Id } from 'src/common/decorators/id.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Resolver(() => Listen)
export class ListenResolver {
  constructor(
    private listenService: ListenService,
    private songService: SongService,
    private userService: UserService,
  ) {}

  @Mutation(returns => ListenToSongResponse)
  @UseGuards(JwtAuthGuard)
  async listenToSong(
    @Args('input') listenToSongData: ListenToSongInput,
      @Id() userId: UserId,
  ): Promise<ListenToSongResponse> {
    const body = { userId, ...listenToSongData };
    await this.listenService.produceListenMessage(body);
    return { result: 'Sent to ingestion pipeline' };
  }

  @Query(returns => ListenResponse)
  async listen(@Args('id') id: ListenId): Promise<ListenResponse>{
    const listen = await this.listenService.findListenById(id);
    return { listen };
  }
}