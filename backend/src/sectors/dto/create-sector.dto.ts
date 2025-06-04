import { IsString, MaxLength, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSectorDto {
  @ApiProperty({ example: 'RGT', description: 'Nom du secteur' })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  sectorName?: string;

  @ApiPropertyOptional({
    example: '08:00',
    description: 'Heure de fin pour le client',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === "" ? null : value)
  sectorClientTimeEnd?: string;

  @ApiPropertyOptional({
    example: '17:00',
    description: 'Heure de fin pour le fournisseur',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === "" ? null : value)
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
  @IsString()
  @MaxLength(500)
  sectorDescription?: string;
}
