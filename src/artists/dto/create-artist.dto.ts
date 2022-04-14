import {
  IsString,
  IsUrl,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

// TODO: match url host names
// should some of the urls just be strings maybe?
export class CreateArtistDto extends CreateUserDto {
  @IsString()
  stageName: string;

  @IsString()
  bio: string;

  @IsUrl()
  @IsOptional()
  image: string;

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

export { CreateUserDto };
