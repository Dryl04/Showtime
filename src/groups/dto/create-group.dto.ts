import { IsString, IsEnum, IsNotEmpty, IsUrl, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { MusicGenre } from '../schemas/group.schema';

export class CreateGroupDto {
  @IsNotEmpty({ message: 'Le nom du groupe est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(200, { message: 'Le nom ne peut pas dépasser 200 caractères' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsNotEmpty({ message: 'Le genre est requis' })
  @IsEnum(MusicGenre, { message: 'Le genre doit être valide' })
  genre: MusicGenre;

  @IsNotEmpty({ message: 'L\'URL de l\'image est requise' })
  @IsUrl({}, { message: 'L\'URL doit être valide' })
  @MaxLength(2000, { message: 'L\'URL ne peut pas dépasser 2000 caractères' })
  picture_url: string;
}
