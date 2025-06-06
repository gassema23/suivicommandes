import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestTypeDto {
  @ApiProperty({
    example: 'Retrait complet du service',
    description: 'Nom du type de demande',
  })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  requestTypeName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du type de demande',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  requestTypeDescription?: string;
}
