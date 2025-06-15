import { IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    example: 'Équipe Développement',
    description: "Nom de l'équipe",
  })
  @IsString({
    message: "Le nom de l'équipe doit être une chaîne de caractères.",
  })
  @MaxLength(100, {
    message: "Le nom de l'équipe ne doit pas dépasser 100 caractères.",
  })
  teamName: string;

  @ApiPropertyOptional({
    example: 'Équipe responsable du développement',
    description: "Description de l'équipe",
  })
  @IsOptional()
  @IsString({
    message: "La description de l'équipe doit être une chaîne de caractères.",
  })
  @MaxLength(500, {
    message: "La description de l'équipe ne doit pas dépasser 500 caractères.",
  })
  teamDescription?: string;

  @ApiPropertyOptional({ description: "ID du propriétaire de l'équipe" })
  @IsOptional()
  @IsUUID(undefined, {
    message: "L'identifiant du propriétaire doit être un UUID valide.",
  })
  ownerId?: string;
}
