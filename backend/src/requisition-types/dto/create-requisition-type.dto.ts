import {
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequisitionTypeDto {

  @ApiProperty({ example: 'Exploitation', description: 'Nom du type de réquisition' })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  requisitionTypeName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du type de réquisition',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  requisitionTypeDescription?: string;
}
