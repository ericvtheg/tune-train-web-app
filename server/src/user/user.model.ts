import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { CreateArtistInput, Artist as ArtistModel } from 'src/artist/artist.model';
import { ToBeCreatedArtist, Artist } from 'src/artist/artist.service';

@ObjectType({ description: 'user' })
export class User {
  @Field(type => String)
  username: string;

  @Field(type => String)
  email: string;

  @Field(type => String)
  firstName: string;

  @Field(type => ArtistModel, { nullable: true })
  artist: Artist | null;
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

  @Field(type => CreateArtistInput, { nullable: true })
  artist?: ToBeCreatedArtist;
}

@ObjectType()
export class CreateUserResponse {
  @Field(type => User)
  user: User;
}