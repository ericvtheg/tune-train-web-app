import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { Song } from 'src/song/song.model';
import { ListenId } from 'src/listen/listen.service';
import { SongId } from 'src/song/song.service';
import { User } from 'src/user/user.model';

@ObjectType({ description: 'listen' })
export class Listen {
  @Field(type => ID)
  id: ListenId;

  @Field(type => User)
  user?: User;

  @Field(type => Song)
  song?: Song;

  @Field(type => Boolean)
  liked: boolean;
}

@InputType()
export class ListenToSongInput {
  @Field(type => ID)
  songId: SongId;

  @Field(type => Boolean)
  liked: boolean;
}

@ObjectType()
export class ListenToSongResponse {
  @Field(type => String)
  result: string;
}