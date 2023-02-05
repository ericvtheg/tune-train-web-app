import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({ description: 'artist' })
export class Artist {
  @Field(type => String)
  stageName: string;

  @Field(type => String)
  bio: string;
}

@InputType()
export class CreateArtistInput {
  @Field(type => String)
  stageName: string;

  @Field(type => String)
  bio: string;
}