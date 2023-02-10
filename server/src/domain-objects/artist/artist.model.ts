import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType('Artist')
export class ArtistModel {
  @Field((type) => String)
  stageName: string;

  @Field((type) => String)
  bio: string;
}

@InputType()
export class CreateArtistInput {
  @Field((type) => String)
  stageName: string;

  @Field((type) => String)
  bio: string;
}
