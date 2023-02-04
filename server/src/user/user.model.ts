import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
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