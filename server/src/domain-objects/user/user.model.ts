import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { CreateArtistInput, ArtistModel } from 'src/domain-objects/artist/artist.model';
import { ToBeCreatedArtist, Artist } from 'src/domain-objects/artist/artist.service';

@ObjectType('User')
export class UserModel {
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
  @Field(type => UserModel)
  user: UserModel;
}