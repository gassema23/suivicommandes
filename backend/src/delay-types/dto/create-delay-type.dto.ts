import {
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDelayTypeDto {

  @ApiProperty({ example: 'Service accéléré', description: 'Nom du type de délai' })
  @IsOptional()
  @IsString({ message: 'Le nom du type de délai doit être une chaîne de caractères.' })
  @MaxLength(125, { message: 'Le nom du type de délai ne doit pas dépasser 125 caractères.' })
  delayTypeName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du type de délai',
  })
  @IsOptional()
  @IsString({ message: 'La description du type de délai doit être une chaîne de caractères.' })
  @MaxLength(500, { message: 'La description du type de délai ne doit pas dépasser 500 caractères.' })
  delayTypeDescription?: string;
}