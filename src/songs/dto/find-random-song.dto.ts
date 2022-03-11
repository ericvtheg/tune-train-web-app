import { IsNumber } from 'class-validator';
export class CreateListenDto {
  @IsNumber()
  userId: number;
}
