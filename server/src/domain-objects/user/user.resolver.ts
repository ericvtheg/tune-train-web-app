import { Resolver, Args, Mutation } from '@nestjs/graphql';

import { HashPipe } from 'src/common/pipes/hash.pipe';
import {
  User,
  CreateUserInput,
  CreateUserResponse,
} from 'src/domain-objects/user/user.model';
import { UserService } from 'src/domain-objects/user/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}


  @Mutation(returns => CreateUserResponse)
  async createUser(@Args('input', HashPipe) createUserData: CreateUserInput): Promise<CreateUserResponse> {
    const user = await this.userService.createUser(createUserData);
    return { user };
  }
}