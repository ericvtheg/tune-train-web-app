import { Query, Resolver, Args, ResolveField, Parent } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { UserService, UserId } from 'src/user/user.service';
import { Artist } from 'src/artist/artist.model';
import { ArtistService, ArtistId } from 'src/artist/artist.service';
import { Listen } from 'src/listen/listen.model';
import { ListenService } from 'src/listen/listen.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private artistService: ArtistService,
    private listenService: ListenService,
  ) {}

  @Query(returns => User, { nullable: true })
  async user(@Args('id') id: UserId): Promise<User | null> {
    return await this.userService.findUserById(id);
  }

  @ResolveField('artist', returns => Artist)
  async artist(@Parent() user: User): Promise<Artist | null> {
    const { id } = user;
    return await this.artistService.findArtistById(id as ArtistId);
  }

  @ResolveField('listens', returns => [Listen], { nullable: 'items' })
  async listens(@Parent() user: User): Promise<Listen[]> {
    const { id } = user;
    const listens = await this.listenService.findUserListens(id as UserId);
    return listens.map(listen => ({
      id: listen.id,
      liked: listen.liked,
    }));
  }

  // createUser ...do I want to implement this with a mutation?
}