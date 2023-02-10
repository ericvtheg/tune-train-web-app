import { Resolver, Args, Mutation } from '@nestjs/graphql';
import {
  UserModel,
  CreateUserInput,
  CreateUserResponse,
} from 'src/domain-objects/user/user.model';
import { UserService } from 'src/domain-objects/user/user.service';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation((returns) => CreateUserResponse)
  async createUser(
    @Args('input') createUserData: CreateUserInput
  ): Promise<CreateUserResponse> {
    const user = await this.userService.createUser(createUserData);
    return { user };
  }
}
