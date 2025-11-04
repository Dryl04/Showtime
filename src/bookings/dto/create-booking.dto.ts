import {
  IsMongoId,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
  IsEmail,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBookingDto {
  @IsOptional()
  @IsMongoId({ message: "L'ID utilisateur doit être un ID MongoDB valide" })
  user_id?: string;

  @IsMongoId({ message: "L'ID concert doit être un ID MongoDB valide" })
  concert_id: string;

  @IsNumber({}, { message: 'La quantité doit être un nombre' })
  @Type(() => Number)
  @Min(1, { message: 'La quantité doit être au moins 1' })
  @Max(100, { message: 'La quantité ne peut pas dépasser 100 billets' })
  quantity: number;

  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  @Transform(({ value }) => value?.trim())
  customer_name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Veuillez entrer une adresse e-mail valide' })
  @MaxLength(255, { message: "L'email ne peut pas dépasser 255 caractères" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  customer_email?: string;

  @IsOptional()
  @IsString({ message: 'Le code QR doit être une chaîne de caractères' })
  @MaxLength(10000, { message: 'Le code QR ne peut pas dépasser 10000 caractères' })
  @Transform(({ value }) => value?.trim())
  qr_code?: string;
}
