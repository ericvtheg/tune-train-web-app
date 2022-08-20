import { IsString } from 'class-validator';

export class CreateSongDto {
  @IsString()
  title: string;

  @IsString()
  fileName: string;

  @IsString()
  description: string;

  file: Express.Multer.File;
}
