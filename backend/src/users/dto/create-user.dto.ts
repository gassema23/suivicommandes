import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'Prénom de l\'utilisateur' })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Nom de famille de l\'utilisateur' })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Adresse email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Mot de passe (minimum 8 caractères)' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ description: 'ID de l\'équipe' })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiPropertyOptional({ description: 'URL de l\'image de profil' })
  @IsOptional()
  @IsString()
  profileImage?: string;
}