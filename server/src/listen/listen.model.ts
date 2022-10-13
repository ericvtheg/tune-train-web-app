import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'listen' })
export class Listen {
  @Field(type => ID)
  id: string;
}