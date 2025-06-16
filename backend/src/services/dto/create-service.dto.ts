import { IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'SPAP', description: 'Nom du service' })
  @IsString({
    message: 'Le nom du service doit être une chaîne de caractères.',
  })
  @MaxLength(125, {
    message: 'Le nom du service ne doit pas dépasser 125 caractères.',
  })
  serviceName: string;

  @ApiProperty({
    example: 'RGT',
    description: 'ID du secteur auquel le service appartient',
  })
  @IsUUID(undefined, {
    message: "L'identifiant du secteur doit être un UUID valide.",
  })
  sectorId: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du service',
  })
  @IsOptional()
  @IsString({
    message: 'La description du service doit être une chaîne de caractères.',
  })
  @MaxLength(500, {
    message: 'La description du service ne doit pas dépasser 500 caractères.',
  })
  serviceDescription?: string;
}
