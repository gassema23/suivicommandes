import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSectorDto {
  @ApiProperty({ example: 'RGT', description: 'Nom du secteur' })
  @IsOptional()
  @IsString({
    message: 'Le nom du secteur doit être une chaîne de caractères.',
  })
  @MaxLength(125, {
    message: 'Le nom du secteur ne doit pas dépasser 125 caractères.',
  })
  sectorName?: string;

  @ApiPropertyOptional({
    example: '08:00',
    description: 'Heure de fin pour le client',
  })
  @IsOptional()
  @IsString({
    message: "L'heure de fin client doit être une chaîne de caractères.",
  })
  @Transform(({ value }) => (value === '' ? null : value))
  sectorClientTimeEnd?: string;

  @ApiPropertyOptional({
    example: '17:00',
    description: 'Heure de fin pour le fournisseur',
  })
  @IsOptional()
  @IsString({
    message: "L'heure de fin fournisseur doit être une chaîne de caractères.",
  })
  @Transform(({ value }) => (value === '' ? null : value))
  sectorProviderTimeEnd?: string;

  @ApiProperty({
    example: true,
    description: 'Indique si le secteur est calculé automatiquement',
  })
  @IsOptional()
  isAutoCalculate?: boolean;

  @ApiProperty({
    example: false,
    description: 'Indique si le secteur est conforme',
  })
  @IsOptional()
  isConformity?: boolean;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du secteur',
  })
  @IsOptional()
  @IsString({
    message: 'La description du secteur doit être une chaîne de caractères.',
  })
  @MaxLength(500, {
    message: 'La description du secteur ne doit pas dépasser 500 caractères.',
  })
  sectorDescription?: string;
}
