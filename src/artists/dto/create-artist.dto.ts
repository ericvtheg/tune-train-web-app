import {
  IsString,
  IsUrl,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

import { CreateUserDto } from '../../users/dto/create-user.dto';

// TODO: match url host names
// should some of the urls just be strings maybe?
export class CreateArtistDto extends CreateUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  password: string;

  @IsBoolean({
    message: 'isArtist must be true in order to create Artist entity',
  })
  isArtist: boolean;

  @IsString()
  readonly stageName: string;

  @IsString()
  readonly bio: string;

  @IsUrl()
  readonly image: string;

  @IsUrl({ nullable: true })
  readonly spotify?: string;

  @IsUrl({ nullable: true })
  readonly appleMusic?: string;

  @IsUrl({ nullable: true })
  readonly soundCloud?: string;

  @IsUrl({ nullable: true })
  readonly patreon?: string;

  @IsUrl({ nullable: true })
  readonly instagram?: string;

  @IsUrl({ nullable: true })
  readonly tikTok?: string;

  @IsUrl({ nullable: true })
  readonly youtube?: string;

  @IsUrl({ nullable: true })
  readonly twitter?: string;

  @IsUrl({ nullable: true })
  readonly beatPort?: string;
}

export { CreateUserDto };
