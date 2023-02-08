import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { ArtistModel } from 'src/domain-objects/artist/artist.model';
import { SongId } from 'src/domain-objects/song/song.service';
import { DownloadLink } from 'src/services/file-storage/file-storage.service';

@ObjectType()
export class FileDownload {
  @Field(type => String)
  link: DownloadLink;
}

@ObjectType('Song',{ description: 'song' })
export class SongModel {
  @Field(type => ID)
  id: SongId;

  @Field(type => String)
  title: string;

  @Field(type => String)
  description: string;

  @Field(type => FileDownload)
  fileDownload?: FileDownload;

  @Field(type => ArtistModel)
  artist?: ArtistModel;
}

@InputType()
export class CreateSongInput {
  @Field(type => String)
  title: string;

  @Field(type => String)
  description: string;

  @Field(type => String)
  fileName: string;
}

@ObjectType()
export class DiscoverSongResponse {
  @Field(type => SongModel, { nullable: true })
  song: SongModel | null;
}

@ObjectType()
export class CreateSongResponse {
  @Field(type => SongModel)
  song: SongModel;
}