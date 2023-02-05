import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { Artist } from 'src/domain-objects/artist/artist.model';
import { SongId } from 'src/domain-objects/song/song.service';
import { DownloadLink } from 'src/services/file-storage/file-storage.service';

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
export class DiscoverSongResponse {
  @Field(type => Song, { nullable: true })
  song: Song | null;
}

@ObjectType()
export class CreateSongResponse {
  @Field(type => Song)
  song: Song;
}