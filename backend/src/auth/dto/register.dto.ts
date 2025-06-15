import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le prénom ne doit pas dépasser 50 caractères.' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le nom ne doit pas dépasser 50 caractères.' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: "L'adresse e-mail doit être une adresse valide." })
  email: string;

  @ApiPropertyOptional({ example: 'SecurePass123!' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @IsOptional()
  @IsStrongPassword(
    {},
    {
      message:
        'Le mot de passe doit être complexe (majuscules, minuscules, chiffres et caractères spéciaux).',
    },
  )
  password?: string;

  @ApiPropertyOptional({ example: 'SecurePass123!' })
  @IsOptional()
  @IsStrongPassword(
    {},
    {
      message:
        'La confirmation du mot de passe doit être complexe (majuscules, minuscules, chiffres et caractères spéciaux).',
    },
  )
  confirmPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { message: "L'identifiant du rôle doit être un UUID valide." })
  roleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', {
    message: "L'identifiant de l'équipe doit être un UUID valide.",
  })
  teamId?: string;
}
