import { Query, Resolver, Args } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { UserId } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(returns => User)
  async user(@Args('id') id: UserId): Promise<User> {
    return await this.usersService.findUserById(id);
  }
}