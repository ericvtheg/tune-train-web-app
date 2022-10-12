import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'artist' })
export class Artist {
  @Field(type => ID)
  id: string;

  @Field()
  stageName: string;

  @Field()
  bio: string;

  @Field()
  image: string;

  // User

  // Songs

  // Socials

  // listens

  // add nested type for user (do same on user model)
}