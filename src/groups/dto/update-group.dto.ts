import { IsString, IsEnum, IsOptional, IsUrl, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { MusicGenre } from '../schemas/group.schema';

export class UpdateGroupDto {
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(200, { message: 'Le nom ne peut pas dépasser 200 caractères' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsEnum(MusicGenre, { message: 'Le genre doit être valide' })
  genre?: MusicGenre;

  @IsOptional()
  @IsUrl({}, { message: 'L\'URL doit être valide' })
  @MaxLength(2000, { message: 'L\'URL ne peut pas dépasser 2000 caractères' })
  picture_url?: string;
}
