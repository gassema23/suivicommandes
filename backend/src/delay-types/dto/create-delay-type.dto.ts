import {
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDelayTypeDto {

  @ApiProperty({ example: 'Service accéléré', description: 'Nom du type de délai' })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  delayTypeName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du type de délai',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  delayTypeDescription?: string;
}
