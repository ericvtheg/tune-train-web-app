import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Artist } from 'src/artist/artist.model';
import { Song } from 'src/song/song.model';

@ObjectType({ description: 'listen' })
export class Listen {
  @Field(type => ID)
  id: string;

  @Field(type => Artist)
  artist: Artist;

  @Field(type => Song)
  song: Song;

  @Field(type => Boolean)
  liked?: boolean;
}