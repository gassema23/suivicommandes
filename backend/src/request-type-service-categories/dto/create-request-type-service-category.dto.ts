import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestTypeServiceCategoryDto {
  @ApiProperty({
    example: 'd3f1e2c3-4567-890a-bcde-f1234567890a',
    description: 'ID de la catégorie de service',
  })
  @IsUUID('4', {
    message: "L'ID de la catégorie de service doit être un UUID valide.",
  })
  serviceCategoryId: string;

  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'ID du type de demande',
  })
  @IsUUID('4', { message: "L'ID du type de demande doit être un UUID valide." })
  requestTypeId: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Délai de disponibilité en jours',
  })
  @IsInt({ message: 'Le délai de disponibilité doit être un entier.' })
  @Min(0, {
    message: 'Le délai de disponibilité doit être supérieur ou égal à 0.',
  })
  @IsOptional()
  availabilityDelay?: number;

  @ApiPropertyOptional({
    example: '2',
    description: 'Délai de traitement en jours',
  })
  @IsInt({ message: 'Le délai de traitement doit être un entier.' })
  @Min(0, {
    message: 'Le délai de traitement doit être supérieur ou égal à 0.',
  })
  @IsOptional()
  minimumRequiredDelay?: number;

  @ApiPropertyOptional({
    example: '3',
    description: "Délai d'activation du service en jours",
  })
  @IsInt({ message: "Le délai d'activation du service doit être un entier." })
  @Min(0, {
    message:
      "Le délai d'activation du service doit être supérieur ou égal à 0.",
  })
  @IsOptional()
  serviceActivationDelay?: number;
}
