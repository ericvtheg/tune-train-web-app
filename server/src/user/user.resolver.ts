import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HashPipe } from 'src/common/pipes/hash.pipe';
import {
  User,
  UserResponse,
  CreateUserInput,
  UpdateUserInput,
  UserLoginInput,
  UserLoginResponse,
  CreateUserResponse,
  UpdateUserResponse,
} from 'src/user/user.model';
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

  @Mutation(returns => UserLoginResponse)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('input') userLoginData: UserLoginInput,
      @AccessToken() accessToken: string,
  ): Promise<UserLoginResponse> {
    return { accessToken };
  }

  @Mutation(returns => CreateUserResponse)
  async createUser(@Args('input', HashPipe) createUserData: CreateUserInput): Promise<CreateUserResponse> {
    const user = await this.userService.createUser(createUserData);
    return { user };
  }

  @Mutation(returns => UpdateUserResponse)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('input', HashPipe) updateUserData: UpdateUserInput,
      @Id() id: UserId,
  ): Promise<UpdateUserResponse> {
    const user = await this.userService.updateUser(id, updateUserData);
    return { user };
  }

  @Query(returns => UserResponse)
  async user(@Args('id') id: UserId): Promise<UserResponse> {
    const user = await this.userService.findUserById(id);
    return { user };
  }

  @ResolveField('artist', returns => Artist)
  async artist(@Parent() user: User): Promise<Artist | null> {
    const { id } = user;
    return await this.artistService.findArtistByUserId(id);
  }

  @ResolveField('listens', returns => [Listen], { nullable: 'items' })
  async listens(@Parent() user: User): Promise<Listen[]> {
    const { id } = user;
    return await this.listenService.findUserListens(id);
  }
}