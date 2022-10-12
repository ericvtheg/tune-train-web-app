import { Query, Resolver, Args } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { UserService, UserId } from 'src/user/user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => User,  { nullable: true })
  async user(@Args('id') id: UserId): Promise<User> {
    return await this.userService.findUserById(id);
  }

  // createUser ...do I want to implement this with a mutation?
}