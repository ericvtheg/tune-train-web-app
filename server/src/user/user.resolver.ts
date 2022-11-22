import { Query, Resolver, Args, ResolveField, Parent, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HashPipe } from 'src/common/pipes/hash.pipe';
import { User, CreateUserInput, UpdateUserInput, UserLoginInput, UserLoginOutput } from 'src/user/user.model';
import { UserService, UserId } from 'src/user/user.service';
import { Artist } from 'src/artist/artist.model';
import { ArtistService } from 'src/artist/artist.service';
import { Listen } from 'src/listen/listen.model';
import { ListenService } from 'src/listen/listen.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private artistService: ArtistService,
    private listenService: ListenService,
  ) {}

  @Mutation(returns => UserLoginOutput)
  @UseGuards(LocalAuthGuard)
  async login(@Args('userLoginData') userLoginData: UserLoginInput, @Context() context: any): Promise<UserLoginOutput> {
    const accessToken = context.req.user;
    return { accessToken };
  }

  @Mutation(returns => User)
  async createUser(@Args('createUserData', HashPipe) createUserData: CreateUserInput): Promise<User> {
    return await this.userService.createUser(createUserData);
  }

  @Mutation(returns => User)
  async updateUser(@Args('updateUserData', HashPipe) updateUserData: UpdateUserInput): Promise<User> {
    // TODO Pull userId off authorizer here
    return await this.userService.updateUser('clals4xts000016az9o7wyte3' as UserId, updateUserData);
  }

  @Query(returns => User, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async user(@Args('id') id: UserId): Promise<User | null> {
    return await this.userService.findUserById(id);
  }

  @ResolveField('artist', returns => Artist)
  async artist(@Parent() user: User): Promise<Artist | null> {
    const { id } = user;
    return await this.artistService.findArtistByUserId(id);
  }

  // TODO something is very wrong here why cant I resolve subtypes
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