import {
  IsString,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'SPAP', description: 'Nom du service' })
  @IsString()
  @MaxLength(125)
  serviceName: string;

  @ApiProperty({
    example: 'RGT',
    description: 'ID du secteur auquel le service appartient',
  })
  @IsUUID()
  sectorId: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du secteur',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  serviceDescription?: string;
}
