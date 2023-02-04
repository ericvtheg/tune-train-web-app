import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { ArtistId } from 'src/artist/artist.service';

@ObjectType({ description: 'artist' })
export class Artist {
  @Field(type => ID)
  id: ArtistId;

  @Field(type => String)
  stageName: string;

  @Field(type => String)
  bio: string;

  @Field(type => String)
  image: string;
}

@InputType()
export class CreateArtistInput {
  @Field(type => String)
  stageName: string;

  @Field(type => String)
  bio: string;

  @Field(type => String)
  image: string;
}

@ObjectType()
export class ArtistResponse {
  @Field(type => Artist, { nullable: true })
  artist: Artist | null;
}

@ObjectType()
export class CreateArtistResponse {
  @Field(type => Artist)
  artist: Artist;
}