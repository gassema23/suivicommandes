import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProviderDisponibilityDto {
  @ApiProperty({
    example: 'En attente',
    description: 'Disponibilité du fournisseur',
  })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  providerDisponibilityName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description de la disponibilité du fournisseur',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  providerDisponibilityDescription?: string;
}
