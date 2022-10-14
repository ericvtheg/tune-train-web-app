import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Artist } from "src/artist/artist.model";
import { Listen } from "src/listen/listen.model";

@ObjectType({ description: 'user' })
export class User {
  @Field(type => ID)
  id: string;

  @Field(type => String)
  username: string;

  @Field(type => String)
  email: string;

  @Field(type => String)
  firstName: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(type => Artist)
  artist?: Artist;

  // TODO this should be a connection type
  @Field(type => [Listen], { nullable: 'items' })
  listens?: [Listen];
}