import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConformityTypeDto {
  @ApiProperty({
    example: 'Fournisseur',
    description: 'Nom du type de conformité',
  })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  conformityTypeName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du type de conformité',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  conformityTypeDescription?: string;
}
