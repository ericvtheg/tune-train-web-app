import { IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateListenDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  songId: number;

  @ApiProperty({
    description: 'Whether or not the user liked the song.',
  })
  @IsBoolean()
  liked: boolean;
}
