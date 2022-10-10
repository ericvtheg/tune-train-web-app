import { Query, Resolver, Args } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UserService, UserId } from './user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => User,  { nullable: true })
  async user(@Args('id') id: UserId): Promise<User> {
    // why is there no type error here
    return await this.userService.findUserById(id);
  }

  // createUser ...do I want to implement this with a mutation?
}