import { IsString, IsEmail, IsUrl, IsBoolean } from 'class-validator';

export class CreateSongDto {
  @IsString()
  readonly title: string;

  @IsString() //is this url?
  readonly fileName: string;

  @IsString()
  readonly description?: string;

  /** Song Owner's id */
  @IsString()
  readonly userId: number;
}
