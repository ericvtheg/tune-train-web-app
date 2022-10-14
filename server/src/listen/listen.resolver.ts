import { Resolver, Query, Args } from '@nestjs/graphql';
import { Listen } from 'src/listen/listen.model';
import { UserId } from 'src/user/user.service';
import { ListenService } from 'src/listen/listen.service';

@Resolver(of => Listen)
export class ListenResolver {
  constructor(private listenService: ListenService) {}

  @Query(returns => Listen)
  async listen(@Args('userId', { type: () => String }) userId: UserId){
    return await this.listenService.findUnheardListen(userId);
  }
}