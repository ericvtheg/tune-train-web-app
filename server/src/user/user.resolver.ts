import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
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
import { Id } from 'src/common/decorators/id.decorator';
import { AccessToken } from 'src/common/decorators/access-token.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private artistService: ArtistService,
    private listenService: ListenService,
  ) {}

  @Mutation(returns => UserLoginOutput)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('userLoginData') userLoginData: UserLoginInput,
      @AccessToken() accessToken: string,
  ): Promise<UserLoginOutput> {
    return { accessToken };
  }

  @Mutation(returns => User)
  async createUser(@Args('createUserData', HashPipe) createUserData: CreateUserInput): Promise<User> {
    return await this.userService.createUser(createUserData);
  }

  @Mutation(returns => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('updateUserData', HashPipe) updateUserData: UpdateUserInput,
      @Id() id: UserId,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateUserData);
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

  // TODO something is very wrong here why cant I resolve subtypes
  @ResolveField('listens', returns => [Listen], { nullable: 'items' })
  async listens(@Parent() user: User): Promise<Listen[]> {
    const { id } = user;
    return await this.listenService.findUserListens(id);
  }
}