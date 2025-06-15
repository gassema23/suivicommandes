import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequisitionTypeDto {
  @ApiProperty({
    example: 'Exploitation',
    description: 'Nom du type de réquisition',
  })
  @IsOptional()
  @IsString({
    message:
      'Le nom du type de réquisition doit être une chaîne de caractères.',
  })
  @MaxLength(125, {
    message:
      'Le nom du type de réquisition ne doit pas dépasser 125 caractères.',
  })
  requisitionTypeName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du type de réquisition',
  })
  @IsOptional()
  @IsString({
    message:
      'La description du type de réquisition doit être une chaîne de caractères.',
  })
  @MaxLength(500, {
    message:
      'La description du type de réquisition ne doit pas dépasser 500 caractères.',
  })
  requisitionTypeDescription?: string;
}
