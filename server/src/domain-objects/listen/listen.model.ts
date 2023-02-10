import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { SongId } from 'src/domain-objects/song/song.service';

@InputType()
export class ListenToSongInput {
  @Field((type) => ID)
  songId: SongId;

  @Field((type) => Boolean)
  liked: boolean;
}

@ObjectType()
export class ListenToSongResponse {
  @Field((type) => String)
  result: string;
}
