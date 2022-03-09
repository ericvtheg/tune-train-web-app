import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isArtist: boolean;
}
