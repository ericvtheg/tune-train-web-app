import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Listen } from "src/listen/listen.model";
import { Song } from "src/song/song.model";
import { User } from "src/user/user.model";

@ObjectType({ description: 'artist' })
export class Artist {
  @Field(type => ID)
  id: string;

  @Field(type => String)
  stageName: string;

  @Field(type => String)
  bio: string;

  @Field(type => String)
  image: string;

  // TODO this should be a connection type
  @Field(type => [Listen], { nullable: 'items' })
  listens?: [Listen];

  // TODO this should be a connection type
  @Field(type => [Song], { nullable: 'items' })
  songs?: [Song];

  @Field(type => User)
  user?: User;
}