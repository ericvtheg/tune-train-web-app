import {
  IsString,
  IsUrl,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

// TODO: match url host names
// should some of the urls just be strings maybe?
class CreateSocialsDto {
  @IsUrl()
  @IsOptional()
  spotify?: string;

  @IsUrl()
  @IsOptional()
  appleMusic?: string;

  @IsUrl()
  @IsOptional()
  soundCloud?: string;

  @IsUrl()
  @IsOptional()
  patreon?: string;

  @IsUrl()
  @IsOptional()
  instagram?: string;

  @IsUrl()
  @IsOptional()
  tikTok?: string;

  @IsUrl()
  @IsOptional()
  youtube?: string;

  @IsUrl()
  @IsOptional()
  twitter?: string;

  @IsUrl()
  @IsOptional()
  beatPort?: string;
}

export class CreateArtistDto extends CreateUserDto {
  @IsString()
  stageName: string;

  @IsString()
  bio: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @ValidateNested()
  socials: CreateSocialsDto;
}

export { CreateUserDto };
