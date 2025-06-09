import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProviderDisponibilityDto {
  @ApiProperty({
    example: 'En attente',
    description: 'Disponibilité du fournisseur',
  })
  @IsOptional()
  @IsString({
    message: 'Le nom de la disponibilité doit être une chaîne de caractères.',
  })
  @MaxLength(125, {
    message: 'Le nom de la disponibilité ne doit pas dépasser 125 caractères.',
  })
  providerDisponibilityName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description de la disponibilité du fournisseur',
  })
  @IsOptional()
  @IsString({
    message:
      'La description de la disponibilité doit être une chaîne de caractères.',
  })
  @MaxLength(500, {
    message:
      'La description de la disponibilité ne doit pas dépasser 500 caractères.',
  })
  providerDisponibilityDescription?: string;
}
