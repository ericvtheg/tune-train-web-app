import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'artist' })
export class Artist {
  @Field(type => ID)
  id: string;
}