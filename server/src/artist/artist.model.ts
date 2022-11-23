import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { Listen } from 'src/listen/listen.model';
import { Song } from 'src/song/song.model';
import { User } from 'src/user/user.model';
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

  // TODO this should be a connection type
  @Field(type => [Song], { nullable: 'items' })
  songs?: [Song];

  @Field(type => User)
  user?: User;
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

@InputType()
export class UpdateArtistInput {
  @Field(type => String, { nullable: true })
  stageName?: string;

  @Field(type => String, { nullable: true })
  bio?: string;

  @Field(type => String, { nullable: true })
  image?: string;
}