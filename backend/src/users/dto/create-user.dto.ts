import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: "Prénom de l'utilisateur" })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le prénom ne doit pas dépasser 50 caractères.' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: "Nom de famille de l'utilisateur",
  })
  @IsString({
    message: 'Le nom de famille doit être une chaîne de caractères.',
  })
  @MaxLength(50, {
    message: 'Le nom de famille ne doit pas dépasser 50 caractères.',
  })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Adresse email',
  })
  @IsEmail(
    {},
    { message: "L'adresse email doit être une adresse email valide." },
  )
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Mot de passe (minimum 8 caractères)',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  password: string;

  @ApiPropertyOptional({ description: "ID de l'équipe" })
  @IsOptional()
  @IsUUID(undefined, {
    message: "L'identifiant de l'équipe doit être un UUID valide.",
  })
  teamId?: string;

  @ApiPropertyOptional({ description: "URL de l'image de profil" })
  @IsOptional()
  @IsString({
    message: "L'URL de l'image de profil doit être une chaîne de caractères.",
  })
  profileImage?: string;
}
