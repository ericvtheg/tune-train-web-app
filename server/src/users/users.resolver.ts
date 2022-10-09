import { Query, Resolver, Args } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { UserId } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(returns => User,  { nullable: true })
  async user(@Args('id') id: UserId): Promise<User> {
    return await this.usersService.findUserById(id);
  }

  // I probably want this to be a more general query
  // ie it should have a filter type with multiple different possible params
  @Query(returns => User, { nullable: true })
  async queryUserByEmail(@Args('email') email: string): Promise<User> {
    return await this.usersService.findUserByEmail(email);
  }
}