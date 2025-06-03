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
  @IsString()
  @MaxLength(125)
  serviceCategoryName: string;

  @ApiProperty({
    example: 'SALI',
    description: 'ID du service auquel la catégorie de service appartient',
  })
  @IsUUID()
  serviceId: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Est-ce une catégorie de service multi lien ?',
  })
  @IsOptional()
  @IsBoolean()
  isMultiLink?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Est-ce une catégorie de service multi fournisseur ?',
  })
  @IsOptional()
  @IsBoolean()
  isMultiProvider?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Est-ce que la catégorie de service nécessite une expertise ?',
  })
  @IsOptional()
  @IsBoolean()
  isRequiredExpertise?: boolean;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description de la catégorie de service',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  serviceCategoryDescription?: string;
}
