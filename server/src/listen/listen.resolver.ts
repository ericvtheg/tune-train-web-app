import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Listen, ListenToSongInput, ListenToSongResponse } from 'src/listen/listen.model';
import { ListenService } from 'src/listen/listen.service';
import { Id } from 'src/common/decorators/id.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserId } from 'src/user/user.service';

@Resolver(() => Listen)
export class ListenResolver {
  constructor(private listenService: ListenService) {}

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
}