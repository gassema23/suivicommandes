import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestTypeDto {
  @ApiProperty({
    example: 'Retrait complet du service',
    description: 'Nom du type de demande',
  })
  @IsOptional()
  @IsString({ message: 'Le nom du type de demande doit être une chaîne de caractères.' })
  @MaxLength(125, { message: 'Le nom du type de demande ne doit pas dépasser 125 caractères.' })
  requestTypeName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du type de demande',
  })
  @IsOptional()
  @IsString({ message: 'La description du type de demande doit être une chaîne de caractères.' })
  @MaxLength(500, { message: 'La description du type de demande ne doit pas dépasser 500 caractères.' })
  requestTypeDescription?: string;
}