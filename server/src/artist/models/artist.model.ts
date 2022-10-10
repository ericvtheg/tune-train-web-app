import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'artist' })
export class User {
  @Field(type => ID)
  id: string;
}