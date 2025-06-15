import {
  IsString,
  MaxLength,
  IsOptional,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceCategoryDto {
  @ApiProperty({
    example: 'N/A',
    description: 'Nom de la catégorie de service',
  })
  @IsString({
    message:
      'Le nom de la catégorie de service doit être une chaîne de caractères.',
  })
  @MaxLength(125, {
    message:
      'Le nom de la catégorie de service ne doit pas dépasser 125 caractères.',
  })
  serviceCategoryName: string;

  @ApiProperty({
    example: 'SALI',
    description: 'ID du service auquel la catégorie de service appartient',
  })
  @IsUUID(undefined, {
    message: "L'identifiant du service doit être un UUID valide.",
  })
  serviceId: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Est-ce une catégorie de service multi lien ?',
  })
  @IsOptional()
  @IsBoolean({ message: 'Le champ isMultiLink doit être un booléen.' })
  isMultiLink?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Est-ce une catégorie de service multi fournisseur ?',
  })
  @IsOptional()
  @IsBoolean({ message: 'Le champ isMultiProvider doit être un booléen.' })
  isMultiProvider?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Est-ce que la catégorie de service nécessite une expertise ?',
  })
  @IsOptional()
  @IsBoolean({ message: 'Le champ isRequiredExpertise doit être un booléen.' })
  isRequiredExpertise?: boolean;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description de la catégorie de service',
  })
  @IsOptional()
  @IsString({
    message:
      'La description de la catégorie de service doit être une chaîne de caractères.',
  })
  @MaxLength(500, {
    message:
      'La description de la catégorie de service ne doit pas dépasser 500 caractères.',
  })
  serviceCategoryDescription?: string;
}
