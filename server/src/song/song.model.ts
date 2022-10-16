import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Artist } from "src/artist/artist.model";
import { Listen } from "src/listen/listen.model";

@ObjectType({ description: 'song' })
export class Song {
  @Field(type => ID)
  id: string;

  @Field(type => String)
  title: string;

  @Field(type => String)
  description: string;

  @Field(type => String)
  downloadLink?: string;

  // TODO this should be a connection type
  @Field(type => [Listen], { nullable: 'items' })
  listens?: [Listen];
}