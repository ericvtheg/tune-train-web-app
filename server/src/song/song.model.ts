import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'song' })
export class Song {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  // artist

  // listens
}