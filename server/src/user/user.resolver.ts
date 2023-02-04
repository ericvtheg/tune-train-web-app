import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HashPipe } from 'src/common/pipes/hash.pipe';
import {
  User,
  CreateUserInput,
  UserLoginInput,
  UserLoginResponse,
  CreateUserResponse,
} from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { AccessToken } from 'src/common/decorators/access-token.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
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
}