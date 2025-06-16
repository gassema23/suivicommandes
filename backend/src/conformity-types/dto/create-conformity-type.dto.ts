import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConformityTypeDto {
  @ApiProperty({
    example: 'Type de conformité A',
    description: 'Nom du type de conformité',
  })
  @IsString({
    message: 'Le nom du type de conformité doit être une chaîne de caractères.',
  })
  @MaxLength(125, {
    message:
      'Le nom du type de conformité ne doit pas dépasser 125 caractères.',
  })
  conformityTypeName: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du type de conformité',
  })
  @IsOptional()
  @IsString({
    message:
      'La description du type de conformité doit être une chaîne de caractères.',
  })
  @MaxLength(500, {
    message:
      'La description du type de conformité ne doit pas dépasser 500 caractères.',
  })
  conformityTypeDescription?: string;
}
