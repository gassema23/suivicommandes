import { IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubdivisionClientDto {
  @ApiPropertyOptional({
    example: 'Une subdivision',
    description: 'Nom de la subdivision client',
  })
  @IsString({
    message:
      'Le nom de la subdivision client doit être une chaîne de caractères.',
  })
  @IsOptional()
  @MaxLength(125, {
    message:
      'Le nom de la subdivision client ne doit pas dépasser 125 caractères.',
  })
  subdivisionClientName?: string;

  @ApiProperty({
    example: '3000',
    description: 'Identifiant de la subdivision',
  })
  @IsString({
    message:
      "L'identifiant de la subdivision doit être une chaîne de caractères.",
  })
  @MaxLength(25, {
    message:
      "L'identifiant de la subdivision ne doit pas dépasser 25 caractères.",
  })
  subdivisionClientNumber: string;

  @ApiPropertyOptional({ description: 'ID du client' })
  @IsUUID(undefined, {
    message: "L'identifiant du client doit être un UUID valide.",
  })
  clientId: string;
}
