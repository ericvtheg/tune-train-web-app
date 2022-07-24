import { IsString, IsNumber } from 'class-validator';

export class CreateSongDto {
  /** Song owner's id */
  @IsNumber()
  artistId: number;

  @IsString()
  title: string;

  @IsString() //is this url?
  fileName: string;

  @IsString()
  description: string;

  file: Express.Multer.File;
}
