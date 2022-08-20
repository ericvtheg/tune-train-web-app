import { IsString } from 'class-validator';

export class CreateSongDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  file: Express.Multer.File;
}
