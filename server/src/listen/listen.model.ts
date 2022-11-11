import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { Artist } from 'src/artist/artist.model';
import { Song } from 'src/song/song.model';
import { ListenId } from 'src/listen/listen.service';
import { SongId } from 'src/song/song.service';
import { ArtistId } from 'src/artist/artist.service';

@ObjectType({ description: 'listen' })
export class Listen {
  @Field(type => ID)
  id: ListenId;

  // do I need this? I can always find artist through song? This even affected my DB schema
  @Field(type => Artist)
  artist?: Artist;

  // what about user?

  @Field(type => Song)
  song?: Song;

  @Field(type => Boolean)
  liked: boolean;
}

@InputType()
export class ListenToSongInput {
  @Field(type => ID)
  songId: SongId;

  @Field(type => ID)
  artistId: ArtistId;

  // userId here?

  @Field(type => Boolean)
  liked: boolean;
}