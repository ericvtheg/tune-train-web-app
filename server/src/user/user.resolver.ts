import { Query, Resolver, Args } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UserService, UserId } from './user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => User,  { nullable: true })
  async user(@Args('id') id: UserId): Promise<User> {
    return await this.userService.findUserById(id);
  }

  // I probably want this to be a more general query
  // ie it should have a filter type with multiple different possible params
  // also if I do something like this...validate that it is an email type
  @Query(returns => User, { nullable: true })
  async queryUserByEmail(@Args('email') email: string): Promise<User> {
    return await this.userService.findUserByEmail(email);
  }

  // createUser ...do I want to implement this with a mutation?
}