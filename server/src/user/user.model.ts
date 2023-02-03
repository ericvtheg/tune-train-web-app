import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { Artist } from 'src/artist/artist.model';
import { Listen } from 'src/listen/listen.model';
import { UserId } from 'src/user/user.service';

@ObjectType({ description: 'user' })
export class User {
  @Field(type => ID)
  id: UserId;

  @Field(type => String)
  username: string;

  @Field(type => String)
  email: string;

  @Field(type => String)
  firstName: string;

  @Field(type => String, { nullable: true })
  lastName: string | null;

  @Field(type => Artist, { nullable: true })
  artist?: Artist;

  // TODO this should be a connection type
  @Field(type => [Listen], { nullable: 'items' })
  listens?: [Listen];
}

@ObjectType()
export class UserResponse {
  @Field(type => UserResponse, { nullable: true })
  user: User | null;
}

@InputType()
export class UserLoginInput {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;
}

@ObjectType()
export class UserLoginResponse {
  @Field(() => String)
  accessToken: string;
}

@InputType()
export class CreateUserInput {
  @Field(type => String)
  username: string;

  @Field(type => String)
  password: string;

  @Field(type => String)
  email: string;

  @Field(type => String)
  firstName: string;

  @Field(type => String, { nullable: true })
  lastName: string | null;
}

@ObjectType()
export class CreateUserResponse {
  @Field(type => User)
  user: User;
}

@InputType()
export class UpdateUserInput {
  @Field(type => String, { nullable: true })
  username?: string;

  @Field(type => String, { nullable: true })
  password?: string;

  @Field(type => String, { nullable: true })
  firstName?: string;

  @Field(type => String, { nullable: true })
  lastName?: string | null;
}

@ObjectType()
export class UpdateUserResponse {
  @Field(type => User)
  user: User;
}