import {
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsUrl,
  IsMongoId,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateConcertDto {
  @IsOptional()
  @IsMongoId({ message: 'ID utilisateur invalide' })
  user_id?: string;

  @IsOptional()
  @IsString({ message: 'Le nom du groupe doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom du groupe doit contenir au moins 2 caractères' })
  @MaxLength(200, { message: 'Le nom du groupe ne peut pas dépasser 200 caractères' })
  @Transform(({ value }) => value?.trim())
  name_group?: string;

  @IsOptional()
  @IsString({ message: 'Le nom du concert doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom du concert doit contenir au moins 2 caractères' })
  @MaxLength(200, { message: 'Le nom du concert ne peut pas dépasser 200 caractères' })
  @Transform(({ value }) => value?.trim())
  name_concert?: string;

  @IsOptional()
  @IsString({ message: 'Le genre doit être une chaîne de caractères' })
  @MaxLength(100, { message: 'Le genre ne peut pas dépasser 100 caractères' })
  @Transform(({ value }) => value?.trim())
  genre?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La date doit être valide' })
  date?: Date;

  @IsOptional()
  @IsString({ message: 'Le lieu doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le lieu doit contenir au moins 2 caractères' })
  @MaxLength(300, { message: 'Le lieu ne peut pas dépasser 300 caractères' })
  @Transform(({ value }) => value?.trim())
  place?: string;

  @IsOptional()
  @IsUrl({}, { message: 'L\'URL de l\'image doit être valide' })
  @MaxLength(2000, { message: 'L\'URL ne peut pas dépasser 2000 caractères' })
  picture_url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0, { message: 'Le prix ne peut pas être négatif' })
  @Max(10000000, { message: 'Le prix ne peut pas dépasser 10,000,000' })
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Le nombre de billets doit être un nombre' })
  @Min(0, { message: 'Le nombre de billets ne peut pas être négatif' })
  @Max(100000, { message: 'Le nombre de billets ne peut pas dépasser 100,000' })
  number_of_ticket?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Les billets restants doivent être un nombre' })
  @Min(0, { message: 'Les billets restants ne peuvent pas être négatifs' })
  @Max(100000, { message: 'Les billets restants ne peuvent pas dépasser 100,000' })
  ticket_left?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Les billets vendus doivent être un nombre' })
  @Min(0, { message: 'Les billets vendus ne peuvent pas être négatifs' })
  @Max(100000, { message: 'Les billets vendus ne peuvent pas dépasser 100,000' })
  ticket_sold?: number;
}