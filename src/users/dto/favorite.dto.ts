import { IsString } from 'class-validator';

export class FavoriteDto {
  @IsString()
  bandId: string;
}
