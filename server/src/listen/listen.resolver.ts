import { Resolver, Query, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { Listen, ListenToSongInput } from 'src/listen/listen.model';
import { UserId, UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';
import { ListenService, ListenId } from 'src/listen/listen.service';
import { ListenQueue } from 'src/listen/listen.queue';
import { Song } from 'src/song/song.model';
import { SongService } from 'src/song/song.service';
import { Artist } from 'src/artist/artist.model';
import { ArtistService } from 'src/artist/artist.service';

@Resolver(() => Listen)
export class ListenResolver {
  constructor(
    private listenService: ListenService,
    private listenQueue: ListenQueue,
    private artistService: ArtistService,
    private songService: SongService,
    private userService: UserService,
  ) {}

  @Mutation(returns => Boolean)
  async listenToSong(@Args('listenToSongData') listenToSongData: ListenToSongInput): Promise<boolean> {
    // pull userId off auth token
    const message = { userId: 'someUserId' as UserId, ...listenToSongData };
    await this.listenQueue.produceListenMessage(message);
    return true;
    // what to return here
  }

  @Query(returns => Listen, { nullable: true })
  async listen(@Args('id') id: ListenId): Promise<Listen | null>{
    return await this.listenService.findListenById(id);
  }

  @ResolveField('artist', returns => Artist)
  async artist(@Parent() listen: Listen): Promise<Artist | null> {
    const { id } = listen;
    return await this.artistService.findArtistByListenId(id);
  }

  @ResolveField('song', returns => Song)
  async song(@Parent() listen: Listen): Promise<Song | null> {
    const { id } = listen;
    return await this.songService.findListenedToSong(id);
  }

  @ResolveField('user', returns => User)
  async user(@Parent() listen: Listen): Promise<User | null> {
    const { id } = listen;
    return await this.userService.findUserByListenId(id);
  }
}