import { IsString, IsEmail, IsUrl, IsBoolean } from 'class-validator';

class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;
}

// TODO: match url host names
// should some of the urls just be strings maybe?
class CreateArtistDtO extends CreateUserDto {
  @IsBoolean()
  readonly isArtist: boolean;

  @IsString()
  readonly stageName: string;

  @IsUrl()
  readonly bio: string;

  @IsUrl()
  readonly image: string;

  @IsUrl()
  readonly spotify?: string;

  @IsUrl()
  readonly appleMusic?: string;

  @IsUrl()
  readonly soundCloud?: string;

  @IsUrl()
  readonly patreon?: string;

  @IsUrl()
  readonly instagram?: string;

  @IsUrl()
  readonly tikTok?: string;

  @IsUrl()
  readonly youtube?: string;

  @IsUrl()
  readonly twitter?: string;

  @IsUrl()
  readonly beatPort?: string;
}

export { CreateUserDto };
