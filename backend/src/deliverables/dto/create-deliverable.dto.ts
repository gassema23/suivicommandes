import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeliverableDto {
  @ApiProperty({
    example: 'Étude de faisabilité',
    description: 'Nom du livrable',
  })
  @IsOptional()
  @IsString({ message: 'Le nom du livrable doit être une chaîne de caractères.' })
  @MaxLength(125, { message: 'Le nom du livrable ne doit pas dépasser 125 caractères.' })
  deliverableName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du livrable',
  })
  @IsOptional()
  @IsString({ message: 'La description du livrable doit être une chaîne de caractères.' })
  @MaxLength(500, { message: 'La description du livrable ne doit pas dépasser 500 caractères.' })
  deliverableDescription?: string;
}