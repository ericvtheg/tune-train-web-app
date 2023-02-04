import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { Artist } from 'src/artist/artist.model';
import { SongId } from 'src/song/song.service';
import { DownloadLink } from 'src/common/services/file-storage/file-storage.service';

@ObjectType()
export class FileDownload {
  @Field(type => String)
  link: DownloadLink;
}

@ObjectType({ description: 'song' })
export class Song {
  @Field(type => ID)
  id: SongId;

  @Field(type => String)
  title: string;

  @Field(type => String)
  description: string;

  @Field(type => FileDownload)
  fileDownload?: FileDownload;

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

@ObjectType()
export class SongResponse {
  @Field(type => Song, { nullable: true })
  song: Song | null;
}

@ObjectType()
export class DiscoverSongResponse {
  @Field(type => Song, { nullable: true })
  song: Song | null;
}

@ObjectType()
export class CreateSongResponse {
  @Field(type => Song)
  song: Song;
}

@ObjectType()
export class DeleteSongResponse {
  @Field(type => String)
  result: string;
}