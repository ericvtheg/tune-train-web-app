import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { User, CreateUserInput, UpdateUserInput } from 'src/user/user.model';
import { UserService, UserId } from 'src/user/user.service';
import { Artist } from 'src/artist/artist.model';
import { ArtistService } from 'src/artist/artist.service';
import { Listen } from 'src/listen/listen.model';
import { ListenService } from 'src/listen/listen.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private artistService: ArtistService,
    private listenService: ListenService,
  ) {}

  @Mutation(returns => User)
  async createUser(@Args('createUserData') createUserData: CreateUserInput): Promise<User> {
    // TODO deal with hashing passwords
    return await this.userService.createUser(createUserData);
  }

  @Mutation(returns => User)
  async updateUser(@Args('updateUserData') updateUserData: UpdateUserInput): Promise<User> {
    // TODO deal with hashing passwords
    // TODO Pull userId off authorizer here
    return await this.userService.updateUser('someid' as UserId, updateUserData);
  }

  @Query(returns => User, { nullable: true })
  async user(@Args('id') id: UserId): Promise<User | null> {
    return await this.userService.findUserById(id);
  }

  @ResolveField('artist', returns => Artist)
  async artist(@Parent() user: User): Promise<Artist | null> {
    const { id } = user;
    return await this.artistService.findArtistByUserId(id);
  }

  // TODO something is very wrong here
  @ResolveField('listens', returns => [Listen], { nullable: 'items' })
  async listens(@Parent() user: User): Promise<Listen[]> {
    const { id } = user;
    const listens = await this.listenService.findUserListens(id);
    return listens.map(listen => ({
      id: listen.id,
      liked: listen.liked,
    }));
  }
}