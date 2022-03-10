import { IsNumber, IsBoolean } from 'class-validator';
export class CreateListenDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  songId: number;

  @IsBoolean()
  liked: boolean;
}
