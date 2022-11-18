import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { Artist } from 'src/artist/artist.model';
import { Listen } from 'src/listen/listen.model';
import { SongId } from 'src/song/song.service';
import { DownloadLink } from 'src/common/services/file-storage/file-storage.service';

@ObjectType({ description: 'song' })
export class Song {
  @Field(type => ID)
  id: SongId;

  @Field(type => String)
  title: string;

  @Field(type => String)
  description: string;

  @Field(type => String)
  downloadLink?: DownloadLink;

  // TODO this should be a connection type
  @Field(type => [Listen], { nullable: 'items' })
  listens?: [Listen];

  @Field(type => Artist)
  artist?: Artist;
}

@InputType()
export class CreateSongInput {
  @Field(type => String)
  title: string;

  @Field(type => String)
  description: string;
}